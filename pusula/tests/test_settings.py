"""Tests for the lock guard, the after-compaction reminder and the settings templates. Standard library only."""
import json
import os
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

import tomllib

ROOT = Path(__file__).resolve().parent.parent
CLAUDE = json.loads((ROOT / "settings" / "claude.settings.json").read_text(encoding="utf-8"))
CODEX = tomllib.loads((ROOT / "settings" / "codex.config.toml").read_text(encoding="utf-8"))
GUARD = ROOT / "checks" / "lock_guard.py"
REMINDER = ROOT / "checks" / "after_compact.py"
READ_RULE = re.compile(r"^Read\((.+)\)$")


def read_globs():
    return [m[1] for m in map(READ_RULE.match, CLAUDE["permissions"]["ask"]) if m]


class ProjectCase(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name).resolve()
        (self.root / ".claude").mkdir()
        (self.root / ".claude" / "settings.json").write_text(json.dumps(CLAUDE), encoding="utf-8")
        self.config = (ROOT / "checks" / "config.json").read_text(encoding="utf-8")

    def run_script(self, script, stdin="", env=None):
        env = {**os.environ, "CLAUDE_PROJECT_DIR": str(self.root), **(env or {})}
        return subprocess.run([sys.executable, str(script)], input=stdin, capture_output=True, text=True, env=env,
                              check=False)


class LockGuard(ProjectCase):
    def decision(self, tool, **tool_input):
        out = self.run_script(GUARD, json.dumps({"tool_name": tool, "tool_input": tool_input}))
        self.assertEqual(out.returncode, 0, out.stderr)
        return json.loads(out.stdout)["hookSpecificOutput"]["permissionDecision"] if out.stdout.strip() else None

    def test_bash_naming_a_lockfile_asks(self):
        self.assertEqual(self.decision("Bash", command="grep -n integrity package-lock.json"), "ask")

    def test_nested_and_absolute_and_directory_paths_ask(self):
        self.assertEqual(self.decision("Bash", command="cat apps/web/yarn.lock | head"), "ask")
        self.assertEqual(self.decision("Bash", command=f"head {self.root}/Cargo.lock"), "ask")
        self.assertEqual(self.decision("Bash", command="cat .next/server/app.js"), "ask")

    def test_redirect_and_quotes_are_seen(self):
        self.assertEqual(self.decision("Bash", command="wc -l < package-lock.json"), "ask")
        self.assertEqual(self.decision("Bash", command="python -c \"open('uv.lock').read()\""), "ask")

    def test_windows_and_powershell_paths_ask(self):
        for cmd in (r"type apps\web\yarn.lock", r"Get-Content .\Cargo.lock", r"Get-Content -Path 'C:\work\game\package-lock.json'",
                    r"dir Library\ScriptAssemblies"):
            self.assertEqual(self.decision("Bash", command=cmd), "ask", cmd)
        self.assertIsNone(self.decision("Bash", command=r"type src\app.ts"))

    def test_grep_tool_path_asks(self):
        self.assertEqual(self.decision("Grep", pattern="x", path="package-lock.json"), "ask")

    def test_ordinary_commands_pass(self):
        for cmd in ("npm run build", "cat package.json", "grep -rn useState src", "git diff --stat", "ls"):
            self.assertIsNone(self.decision("Bash", command=cmd), cmd)

    def test_no_settings_file_means_no_lock(self):
        (self.root / ".claude" / "settings.json").unlink()
        self.assertIsNone(self.decision("Bash", command="cat package-lock.json"))


class AfterCompact(ProjectCase):
    def test_prints_log_and_newest_progress(self):
        pusula = self.root / ".pusula"
        (pusula / "demo").mkdir(parents=True)
        (pusula / "permissions.md").write_text("## Never\n- no new libraries\n", encoding="utf-8")
        (pusula / "demo" / "progress.md").write_text("Next step: tests\n", encoding="utf-8")
        out = self.run_script(REMINDER)
        self.assertIn("no new libraries", out.stdout)
        self.assertIn("Next step: tests", out.stdout)

    def test_silent_without_files_and_capped_with_big_ones(self):
        self.assertEqual(self.run_script(REMINDER).stdout, "")
        limit = json.loads(self.config)["after_compact_max_bytes"]
        (self.root / ".pusula").mkdir()
        (self.root / ".pusula" / "permissions.md").write_text("x" * (limit * 3), encoding="utf-8")
        self.assertLess(len(self.run_script(REMINDER).stdout), limit + 200)


class Templates(unittest.TestCase):
    def test_codex_denies_exactly_the_claude_read_locks(self):
        denied = CODEX["permissions"]["pusula"]["filesystem"][":workspace_roots"]
        self.assertEqual(sorted(read_globs()), sorted(denied))
        self.assertTrue(all(v == "deny" for v in denied.values()))

    def test_hooks_point_at_real_scripts(self):
        commands = [h["command"] for group in CLAUDE["hooks"].values() for entry in group for h in entry["hooks"]]
        for command in commands:
            script = re.search(r"\.pusula/checks/(\w+\.py)", command)[1]
            self.assertTrue((ROOT / "checks" / script).is_file(), script)

    def test_self_protection_and_compaction_are_set(self):
        asks = CLAUDE["permissions"]["ask"]
        self.assertIn("Edit(.claude/settings.json)", asks)
        self.assertIn("Edit(.pusula/checks/**)", asks)
        self.assertGreaterEqual(CLAUDE["autoCompactWindow"], 100000)

    def test_node_modules_is_not_locked(self):
        self.assertFalse([g for g in read_globs() if "node_modules" in g])


class SkillFiles(unittest.TestCase):
    """Front matter must stay valid YAML for every tool: an unquoted `: ` in a value breaks strict parsers."""

    def front_matter(self, path):
        head = path.read_text(encoding="utf-8").split("---\n")[1]
        return dict(line.split(": ", 1) for line in head.splitlines() if line.strip())

    def test_every_skill_has_plain_front_matter(self):
        for path in sorted((ROOT / "skills").glob("*/SKILL.md")):
            fields = self.front_matter(path)
            self.assertEqual(fields["name"], path.parent.name, path)
            description = fields["description"]
            self.assertTrue(description and len(description) <= 1024, path)
            quoted = description[:1] in "\"'"
            self.assertTrue(quoted or (": " not in description and " #" not in description), path)


if __name__ == "__main__":
    unittest.main()

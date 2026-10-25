"""Regression tests for checks/pusula_check.py. Standard library only.

Run: python -m unittest discover -s tests
Tests that need an external tool are skipped when it is not on PATH.
The dependency and sast tests need network access and run only when PUSULA_TEST_NET=1.
"""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

CHECKS = Path(__file__).resolve().parent.parent / "checks"
SCRIPT = CHECKS / "pusula_check.py"
CFG = json.loads((CHECKS / "config.json").read_text(encoding="utf-8"))
HEADINGS = CFG["plan_coverage_headings"]
FENCE = "`" * 3

GOOD_COVERAGE = "\n".join(f"- {h}: none" for h in HEADINGS)


def plan_text(coverage=GOOD_COVERAGE, body=""):
    return f"# Plan: demo\n\n## Goal\nx\n\n## Coverage\n{coverage}\n\n## Steps\n{body}\n"


def code_block(*above):
    return "\n".join(above) + f"\n{FENCE}\nx = 1\n{FENCE}\n"


class CheckCase(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        self.addCleanup(self._tmp.cleanup)

    def write(self, rel, text="", size=None):
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text if size is None else "a" * size, encoding="utf-8")
        return path

    def config_with(self, **change):
        path = self.root.parent / (self.root.name + "-cfg.json")
        path.write_text(json.dumps({**CFG, **change}), encoding="utf-8")
        self.addCleanup(path.unlink, True)
        return ["--config", str(path)]

    def run_check(self, only, extra=(), env=None):
        cmd = [sys.executable, str(SCRIPT), "--root", str(self.root), "--only", only, *extra]
        return subprocess.run(cmd, capture_output=True, text=True, env=env, check=False)


class SizeCheck(CheckCase):
    def test_flags_file_over_limit_only(self):
        self.write("big.txt", size=CFG["max_file_bytes"] + 1)
        self.write("ok.txt", size=CFG["max_file_bytes"])
        self.write("image.png", size=CFG["max_file_bytes"] + 1)
        out = self.run_check("size")
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("big.txt", out.stdout)
        self.assertNotIn("ok.txt", out.stdout)
        self.assertNotIn("image.png", out.stdout)

    def test_clean_project_passes(self):
        self.write("a.txt", "hello")
        self.assertEqual(self.run_check("size").returncode, 0)


class PlanLabels(CheckCase):
    def plan(self, body):
        self.write(".pusula/demo/plan.md", plan_text(body=body))
        return self.run_check("plan")

    def test_labelled_block_passes(self):
        out = self.plan(code_block("Why code: exact signature", "Checked: ran in this session"))
        self.assertEqual(out.returncode, 0, out.stdout)

    def test_url_counts_as_checked(self):
        out = self.plan(code_block("Why code: fixed text", "Checked: https://example.org/docs"))
        self.assertEqual(out.returncode, 0, out.stdout)

    def test_unlabelled_block_fails_for_both_labels(self):
        out = self.plan(code_block("Just some text"))
        self.assertEqual(out.returncode, 1)
        self.assertIn("'Why code:'", out.stdout)
        self.assertIn("'Checked:'", out.stdout)

    def test_checked_needs_evidence(self):
        out = self.plan(code_block("Why code: x", "Checked: looks right"))
        self.assertEqual(out.returncode, 1)
        self.assertIn("needs a URL", out.stdout)

    def test_unverified_is_accepted(self):
        out = self.plan(code_block("Why code: x", "Checked: UNVERIFIED"))
        self.assertEqual(out.returncode, 0, out.stdout)

    def test_nested_fence_is_one_block(self):
        inner = f"````\n{FENCE}\nx\n{FENCE}\n````\n"
        out = self.plan("Why code: x\nChecked: UNVERIFIED\n" + inner)
        self.assertEqual(out.returncode, 0, out.stdout)

    def test_file_outside_plan_globs_is_ignored(self):
        self.write("notes/other.md", code_block("nothing"))
        self.assertEqual(self.run_check("plan").returncode, 0)


class PlanCoverage(CheckCase):
    def run_plan(self, text):
        self.write("docs/plans/demo.md", text)
        return self.run_check("plan")

    def test_full_coverage_passes(self):
        self.assertEqual(self.run_plan(plan_text()).returncode, 0)

    def test_empty_line_fails(self):
        coverage = GOOD_COVERAGE.replace("- Security: none", "- Security:")
        out = self.run_plan(plan_text(coverage))
        self.assertEqual(out.returncode, 1)
        self.assertIn("'Security' is empty", out.stdout)

    def test_placeholder_fails(self):
        coverage = GOOD_COVERAGE.replace("- Tests: none", "- Tests: <decision, risk, unknown>")
        out = self.run_plan(plan_text(coverage))
        self.assertIn("'Tests' is empty", out.stdout)

    def test_missing_line_fails(self):
        coverage = GOOD_COVERAGE.replace("- Conflicts: none", "")
        out = self.run_plan(plan_text(coverage))
        self.assertIn("'Conflicts' is missing", out.stdout)

    def test_missing_section_fails(self):
        out = self.run_plan("# Plan\n\n## Goal\nx\n")
        self.assertIn("no '## Coverage' section", out.stdout)

    def test_template_itself_fails(self):
        template = CHECKS.parent / "skills" / "state-files" / "templates" / "plan.md"
        out = self.run_plan(template.read_text(encoding="utf-8"))
        self.assertEqual(out.returncode, 1)
        self.assertIn("is empty", out.stdout)


class NotChecked(CheckCase):
    def bare_env(self):
        """PATH with git only, so no analysis tool can be found."""
        bin_dir = self.root.parent / (self.root.name + "-bin")
        bin_dir.mkdir()
        self.addCleanup(shutil.rmtree, bin_dir, True)
        (bin_dir / "git").symlink_to(shutil.which("git"))
        return {**os.environ, "PATH": str(bin_dir)}

    def test_missing_tools_exit_2_and_say_so(self):
        self.write("a.txt", "x")
        out = self.run_check("size,hardcode,secrets,sast,complexity,deps", env=self.bare_env())
        self.assertEqual(out.returncode, 2, out.stdout)
        for name in ("hardcode", "secrets", "sast", "complexity", "deps"):
            self.assertIn(f"[NOT CHECKED] {name}", out.stdout)
        self.assertIn("INCOMPLETE", out.stdout)

    def test_findings_beat_not_checked(self):
        self.write("big.txt", size=CFG["max_file_bytes"] + 1)
        out = self.run_check("size,secrets", env=self.bare_env())
        self.assertEqual(out.returncode, 1)


@unittest.skipUnless(shutil.which(CFG["tools"]["semgrep"]["exe"]), "semgrep not installed")
class HardcodeCheck(CheckCase):
    def test_flags_literals_and_passes_clean_code(self):
        self.write("ui/Menu.cs", 'label.text = "Play";\nvar c = new Color(1, 0, 0);\n')
        self.write("web/app.ts", "const bg = '#" + "ff0000';\n")
        self.write("web/clean.ts", "const bg = theme.background;\n")
        out = self.run_check("hardcode")
        self.assertEqual(out.returncode, 1, out.stdout)
        for rule in ("pusula-unity-literal-ui-text", "pusula-unity-literal-color", "pusula-hardcoded-hex-color"):
            self.assertIn(rule, out.stdout)
        self.assertNotIn("clean.ts", out.stdout)


@unittest.skipUnless(shutil.which(CFG["tools"]["semgrep"]["exe"]), "semgrep not installed")
class SastCheck(CheckCase):
    def test_broken_ruleset_is_not_checked_not_clean(self):
        self.write("app.py", "x = 1\n")
        out = self.run_check("sast", extra=self.config_with(semgrep_rulesets=[str(self.root / "missing.yml")]))
        self.assertEqual(out.returncode, 2, out.stdout)
        self.assertIn("[NOT CHECKED] sast: semgrep did not run", out.stdout)

    def test_broken_hardcode_rules_are_not_checked_not_clean(self):
        self.write("app.py", "x = 1\n")
        out = self.run_check("hardcode", extra=self.config_with(semgrep_rules="semgrep/missing.yml"))
        self.assertEqual(out.returncode, 2, out.stdout)
        self.assertIn("[NOT CHECKED] hardcode", out.stdout)

    @unittest.skipUnless(os.environ.get("PUSULA_TEST_NET") == "1", "set PUSULA_TEST_NET=1 (rules are downloaded)")
    def test_flags_shell_true_and_passes_clean_code(self):
        self.write("bad.py", "import subprocess\n\n\ndef ping(host):\n    return subprocess.run('ping ' + host, shell=True)\n")
        self.write("good.py", "import subprocess\n\n\ndef ping(host):\n    return subprocess.run(['ping', host])\n")
        out = self.run_check("sast")
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("bad.py", out.stdout)
        self.assertNotIn("good.py", out.stdout)


@unittest.skipUnless(shutil.which(CFG["tools"]["gitleaks"]["exe"]), "gitleaks not installed")
class SecretsCheck(CheckCase):
    def test_flags_a_token_and_passes_clean_text(self):
        token = "ghp_" + hashlib.sha256(b"pusula-test").hexdigest()[:36]
        self.write("src/leak.py", f'TOKEN = "{token}"\n')
        self.write("src/ok.py", "TOKEN = None\n")
        out = self.run_check("secrets")
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("leak.py", out.stdout)
        self.assertNotIn("ok.py", out.stdout)


@unittest.skipUnless(os.environ.get("PUSULA_TEST_NET") == "1" and shutil.which(CFG["tools"]["osv"]["exe"]),
                     "set PUSULA_TEST_NET=1 and install osv-scanner")
class DepsCheck(CheckCase):
    def test_flags_a_known_vulnerable_package(self):
        lock = {"name": "demo", "lockfileVersion": 3, "packages": {
            "": {"name": "demo", "dependencies": {"lodash": "4.17.15"}},
            "node_modules/lodash": {"version": "4.17.15",
                                    "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.15.tgz"}}}
        self.write("package-lock.json", json.dumps(lock))
        out = self.run_check("deps")
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("lodash", out.stdout)


@unittest.skipUnless(shutil.which(CFG["tools"]["lizard"]["exe"]), "lizard not installed")
class ComplexityCheck(CheckCase):
    BRANCHY = "def f(a):\n    r = 0\n" + "".join(f"    if a == {n}:\n        r += {n}\n" for n in range(12)) + "    return r\n"

    def test_flags_a_complex_function_and_passes_a_simple_one(self):
        self.write("app/branchy.py", self.BRANCHY)
        self.write("app/simple.py", "def f(a):\n    return a + 1\n")
        self.write("node_modules/dep/branchy.py", self.BRANCHY)
        out = self.run_check("complexity")
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("branchy.py", out.stdout)
        self.assertNotIn("simple.py", out.stdout)
        self.assertNotIn("node_modules", out.stdout)

    def test_limit_comes_from_config(self):
        self.write("app/branchy.py", self.BRANCHY)
        out = self.run_check("complexity", extra=self.config_with(complexity_max=50))
        self.assertEqual(out.returncode, 0, out.stdout)


class ArchitectureCheck(CheckCase):
    FILE = ".pusula/architecture.md"

    def table(self, *paths):
        rows = "".join(f"| `{p}` | does a thing | fail fast | - |\n" for p in paths)
        return f"# Architecture\n\n## Layers\n| L0 | x | L1 |\n\n## Modules\n| Path | Does what | If it fails | Budget |\n|---|---|---|---|\n{rows}\n## Dependencies\n| `not/a/module` | why |\n"

    def test_no_file_means_nothing_to_check(self):
        out = self.run_check("architecture")
        self.assertEqual(out.returncode, 0, out.stdout)

    def test_existing_paths_and_globs_pass(self):
        self.write("src/inventory/a.py", "x = 1\n")
        self.write(self.FILE, self.table("src/inventory", "src/*/a.py"))
        out = self.run_check("architecture")
        self.assertEqual(out.returncode, 0, out.stdout)

    def test_missing_path_fails(self):
        self.write(self.FILE, self.table("src/gone"))
        out = self.run_check("architecture")
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("src/gone", out.stdout)

    def test_placeholder_and_absolute_paths_fail(self):
        self.write(self.FILE, self.table("<module path>", "/etc"))
        out = self.run_check("architecture")
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("placeholder", out.stdout)
        self.assertIn("relative", out.stdout)

    def test_missing_modules_section_fails(self):
        self.write(self.FILE, "# Architecture\n\n## Layers\n")
        out = self.run_check("architecture")
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("## Modules", out.stdout)

    def test_only_the_modules_section_is_read(self):
        self.write("src/ok.py", "x = 1\n")
        self.write(self.FILE, self.table("src/ok.py"))
        out = self.run_check("architecture")
        self.assertNotIn("not/a/module", out.stdout)


@unittest.skipUnless(shutil.which("git"), "git not installed")
class StagedMode(CheckCase):
    def test_only_staged_files_are_checked(self):
        subprocess.run(["git", "init", "-q"], cwd=self.root, check=True)
        self.write("staged_big.txt", size=CFG["max_file_bytes"] + 1)
        self.write("loose_big.txt", size=CFG["max_file_bytes"] + 1)
        subprocess.run(["git", "add", "staged_big.txt"], cwd=self.root, check=True)
        out = self.run_check("size", extra=["--staged"])
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("staged_big.txt", out.stdout)
        self.assertNotIn("loose_big.txt", out.stdout)

    def test_project_in_a_subfolder_of_the_repo(self):
        subprocess.run(["git", "init", "-q"], cwd=self.root, check=True)
        sub = self.root / "game"
        sub.mkdir()
        (sub / "big.txt").write_text("a" * (CFG["max_file_bytes"] + 1), encoding="utf-8")
        subprocess.run(["git", "add", "game/big.txt"], cwd=self.root, check=True)
        cmd = [sys.executable, str(SCRIPT), "--root", str(sub), "--only", "size", "--staged"]
        out = subprocess.run(cmd, capture_output=True, text=True, check=False)
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("big.txt", out.stdout)


if __name__ == "__main__":
    unittest.main()

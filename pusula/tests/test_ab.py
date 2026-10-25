"""Tests for the A/B tooling in tests/ab: log parsing, pack-read audit, scoring cross-check, folder build.

The model call itself is never run here; fake stream-json logs stand in for it.
"""
import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

AB = Path(__file__).resolve().parent / "ab"
sys.path.insert(0, str(AB.parent))


def load(name):
    spec = importlib.util.spec_from_file_location(name, AB / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


grade, runner = load("grade_ab"), load("run_ab")


def log_lines(calls, text="cevap", cost=0.1, turns=3):
    events = [{"type": "assistant", "message": {"content": [{"type": "tool_use", "name": n, "input": i} for n, i in calls]}},
              {"type": "result", "result": text, "total_cost_usd": cost, "num_turns": turns, "is_error": False}]
    return "\n".join(json.dumps(e) for e in events)


class Grading(unittest.TestCase):
    def parsed(self, calls, **kw):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "p1-B-1.jsonl"
            path.write_text(log_lines(calls, **kw), encoding="utf-8")
            return grade.parse(path)

    def test_parse_collects_skills_reads_cost_and_text(self):
        info = self.parsed([("Skill", {"skill": "recipes"}), ("Read", {"file_path": "/x/packs/sales.md"}), ("Grep", {"pattern": "a"})])
        self.assertEqual(info["skills"], ["recipes"])
        self.assertEqual(info["reads"], ["/x/packs/sales.md"])
        self.assertEqual((info["text"], info["cost"], info["turns"], info["error"]), ("cevap", 0.1, 3, False))

    def test_audit_needs_the_expected_pack_not_just_any(self):
        right = grade.pack_hits(self.parsed([("Read", {"file_path": "/x/packs/sales.md"})]), "p1")
        wrong = grade.pack_hits(self.parsed([("Read", {"file_path": "/x/packs/unity.md"})]), "p1")
        self.assertTrue(right["expected"] and not wrong["expected"] and wrong["any_pack"])

    def test_audit_does_not_confuse_a_pack_with_a_longer_name(self):
        info = self.parsed([("Read", {"file_path": "/x/packs/not-sales.md"})])
        self.assertFalse(grade.pack_hits(info, "p1")["expected"])

    def test_control_probe_has_no_expected_pack(self):
        self.assertFalse(grade.pack_hits(self.parsed([("Read", {"file_path": "/x/packs/sales.md"})]), "p5")["expected"])

    def test_score_row_sums_manual_scores_and_reports_regex_disagreement(self):
        data = self.parsed([], text="Ücret $100 ve 30 gün bekle")
        row = grade.score_row("p1", "A", data, {"1": 1, "2": 0, "3": 0})
        self.assertEqual(row["score"], 1)
        self.assertIn(2, row["diff"])
        self.assertNotIn(1, row["diff"])
        self.assertIsNone(row["audit"])

    def test_items_cover_every_probe_file(self):
        probes = sorted(p.stem for p in (AB / "probes").glob("p*.txt"))
        self.assertEqual(probes, sorted(grade.ITEMS))


class Folders(unittest.TestCase):
    def build(self, probe, arm):
        tmp = tempfile.TemporaryDirectory()
        folder = Path(tmp.name) / "run"
        runner.build(folder, probe, arm)
        self.addCleanup(tmp.cleanup)
        return folder

    def test_arm_a_has_no_pusula_files(self):
        folder = self.build("p3", "A")
        self.assertFalse((folder / "AGENTS.md").exists() or (folder / ".claude").exists())
        self.assertTrue((folder / "app" / "dashboard" / "actions.ts").exists())

    def test_arm_b_adds_rules_and_skills(self):
        folder = self.build("p3", "B")
        self.assertTrue((folder / "AGENTS.md").exists() and (folder / "CLAUDE.md").exists())
        self.assertTrue((folder / ".claude" / "skills" / "recipes" / "SKILL.md").exists())

    def test_control_probe_gets_a_scratch_readme(self):
        self.assertTrue((self.build("p5", "A") / "README.md").exists())

    def test_every_probe_has_a_prompt(self):
        for probe in grade.ITEMS:
            self.assertTrue((AB / "probes" / f"{probe}.txt").read_text(encoding="utf-8").strip())


if __name__ == "__main__":
    unittest.main()

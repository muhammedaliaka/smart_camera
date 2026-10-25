"""Tests for checks/shield_report.py with small made-up REA outputs. Standard library only."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

CHECKS = Path(__file__).resolve().parent.parent / "checks"
SCRIPT = CHECKS / "shield_report.py"
CFG = json.loads((CHECKS / "config.json").read_text(encoding="utf-8"))
SHIELD = CFG["shield"]
OPERATION = next(iter(SHIELD["report"]["extractors"]))
MEASURE_KEYS = [k for k in SHIELD["report"]["growth_kind"] if k != SHIELD["report"]["size_budget"]]


def literal(path, value):
    return {"kind": "literal", "identity": {"module_path": path}, "label": "literal", "properties": {"value": value}}


def function(path, name):
    return {"kind": "function", "identity": {"module_path": path}, "label": name, "properties": {"name": name}}


def slot(path, name, presence):
    return {"kind": "property-slot", "identity": {"module_path": path}, "label": name,
            "properties": {"name": name, "presence": presence}}


class ReportCase(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name)
        self.project = {"stack": "web", "release_dir": "out", "exclude": [],
                        "classes": {"ai": ["ai/*"], "economy": ["eco/*"], "network": ["net/*"], "content": ["data/*"]},
                        "budgets": {"max_size_growth_pct": 50, "max_startup_ms_growth": 20, "max_frame_ms_growth": 2,
                                    "max_recall_pct": 30}}
        self.dirs = {}
        for name, size in (("plain", 100), ("protected", 120)):
            self.dirs[name] = self.root / name
            self.dirs[name].mkdir()
            (self.dirs[name] / "main.js").write_text("a" * size)

    def analysis(self, name, nodes, operation=OPERATION):
        path = self.root / f"{name}.json"
        data = {"operation": operation, "subject": {"local_path": str(self.dirs[name])},
                "normalized_result": {"semantic_graph": {"nodes": nodes}}}
        path.write_text(json.dumps(data))
        return path

    def report(self, plain_nodes, protected_nodes, measure=True, extra=()):
        (self.root / SHIELD["project_config"]).parent.mkdir(exist_ok=True)
        (self.root / SHIELD["project_config"]).write_text(json.dumps(self.project))
        cmd = [sys.executable, str(SCRIPT), str(self.analysis("plain", plain_nodes)),
               str(self.analysis("protected", protected_nodes)), "--root", str(self.root), *extra]
        for key in MEASURE_KEYS if measure else []:
            cmd += ["--measure", key, "10", "12"]
        return subprocess.run(cmd, capture_output=True, text=True, check=False)

    @staticmethod
    def table(out):
        rows = [[c.strip() for c in ln.strip("|").split("|")] for ln in out.stdout.splitlines() if ln.startswith("| ")]
        return {r[0]: r for r in rows if len(r) == 5 and r[1].isdigit()}


class Recall(ReportCase):
    PLAIN = (function("ai/a.js", "pickTarget"), function("eco/e.js", "unitCost"), literal("net/n.js", "/ranked/submit"))

    def test_unprotected_build_is_over_the_recall_budget(self):
        out = self.report(self.PLAIN, self.PLAIN)
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertEqual(self.table(out)["ai"][:4], ["ai", "1", "1", "100"])

    def test_hidden_names_pass_when_every_budget_is_measured(self):
        out = self.report([*self.PLAIN, function("data/d.js", "campaign")], [])
        self.assertEqual(out.returncode, 0, out.stdout)
        self.assertEqual(self.table(out)["economy"][2], "0")

    def test_a_class_with_no_canaries_is_not_covered_not_clean(self):
        out = self.report(self.PLAIN, [])
        self.assertEqual(out.returncode, 2, out.stdout)
        self.assertIn("NOT COVERED", out.stdout)

    def test_strings_must_stand_alone_in_the_protected_output(self):
        plain = [function("ai/a.js", "url"), function("data/d.js", "campaign")]
        self.report(plain, [])
        protected = [function("ai/a.js", "curl"), function("ai/a.js", "urls")]
        self.assertEqual(self.table(self.report(plain, protected))["ai"][2], "0")
        self.assertEqual(self.table(self.report(plain, [function("eco/e.js", "url")]))["ai"][2], "1")

    def test_numbers_match_by_value_not_by_text(self):
        plain = [literal("eco/e.js", 120), function("data/d.js", "campaign")]
        noise = [literal("eco/e.js", 1200), function("eco/e.js", "a120b")]
        self.assertEqual(self.table(self.report(plain, noise))["economy"][2], "0")
        self.assertEqual(self.table(self.report(plain, [literal("net/n.js", 120)]))["economy"][2], "1")

    def test_only_declared_properties_count(self):
        plain = [slot("ai/a.js", "hpValue", "present"), slot("ai/a.js", "sorted", "unknown-coverage")]
        self.assertEqual(self.table(self.report(plain, []))["ai"][1], "1")

    def test_short_values_are_skipped_and_counted(self):
        plain = [literal("eco/e.js", 90), function("eco/e.js", "unitCost")]
        out = self.report(plain, [])
        self.assertEqual(self.table(out)["economy"][1], "1")
        self.assertIn("Skipped as shorter than", out.stdout)

    def test_excluded_paths_are_left_out_and_unmatched_paths_get_their_own_row(self):
        self.project["exclude"] = ["eco/*"]
        out = self.report([function("eco/e.js", "unitCost"), function("misc/m.js", "bootGame")], [])
        rows = self.table(out)
        self.assertEqual(rows["economy"][1], "0")
        self.assertEqual(rows[SHIELD["report"]["unclassified"]][1], "1")
        self.assertIn("Excluded by config: 1", out.stdout)


class Budgets(ReportCase):
    PLAIN = (function("ai/a.js", "pickTarget"), function("eco/e.js", "unitCost"), function("net/n.js", "startNet"),
             function("data/d.js", "campaign"))

    def test_size_limit_is_a_percentage_not_a_byte_count(self):
        (self.dirs["plain"] / "main.js").write_text("a" * 1000)
        (self.dirs["protected"] / "main.js").write_text("a" * 1200)
        self.assertEqual(self.report(self.PLAIN, []).returncode, 0)

    def test_size_growth_over_the_limit_fails(self):
        (self.dirs["protected"] / "main.js").write_text("a" * 400)
        self.assertEqual(self.report(self.PLAIN, []).returncode, 1)

    def test_unmeasured_budgets_are_not_clean(self):
        out = self.report(self.PLAIN, [], measure=False)
        self.assertEqual(out.returncode, 2, out.stdout)
        self.assertIn("NOT MEASURED", out.stdout)

    def test_slower_start_up_over_the_limit_fails(self):
        out = self.report(self.PLAIN, [], measure=False, extra=["--measure", MEASURE_KEYS[0], "10", "500"])
        self.assertEqual(out.returncode, 1, out.stdout)

    def test_unknown_budget_key_and_bad_number_are_not_checked(self):
        for args in (["--measure", "max_colour", "1", "2"], ["--measure", MEASURE_KEYS[0], "one", "2"]):
            out = self.report(self.PLAIN, [], measure=False, extra=args)
            self.assertEqual(out.returncode, 2, out.stdout)
            self.assertIn("[NOT CHECKED]", out.stdout)

    def test_rea_version_is_printed_or_marked_missing(self):
        self.assertIn("REA version: 6.8.0", self.report(self.PLAIN, [], extra=["--rea-version", "6.8.0"]).stdout)
        self.assertIn("REA version: not recorded", self.report(self.PLAIN, []).stdout)


class NotJudged(ReportCase):
    def test_unknown_operation_is_not_checked(self):
        (self.root / SHIELD["project_config"]).parent.mkdir(exist_ok=True)
        (self.root / SHIELD["project_config"]).write_text(json.dumps(self.project))
        plain, other = self.analysis("plain", []), self.analysis("protected", [], operation="inspect_il2cpp_metadata")
        for pair in ((plain, other), (other, plain)):
            out = subprocess.run([sys.executable, str(SCRIPT), *map(str, pair), "--root", str(self.root)],
                                 capture_output=True, text=True, check=False)
            self.assertEqual(out.returncode, 2, out.stdout)
            self.assertIn("no extractor", out.stdout)

    def test_two_different_operations_are_not_compared(self):
        extractors = SHIELD["report"]["extractors"]
        other = {**CFG, "shield": {**SHIELD, "report": {**SHIELD["report"], "extractors": {**extractors, "other_op": extractors[OPERATION]}}}}
        (self.root / "cfg.json").write_text(json.dumps(other))
        (self.root / SHIELD["project_config"]).parent.mkdir(exist_ok=True)
        (self.root / SHIELD["project_config"]).write_text(json.dumps(self.project))
        pair = (self.analysis("plain", []), self.analysis("protected", [], operation="other_op"))
        out = subprocess.run([sys.executable, str(SCRIPT), *map(str, pair), "--root", str(self.root), "--config", str(self.root / "cfg.json")],
                             capture_output=True, text=True, check=False)
        self.assertEqual(out.returncode, 2, out.stdout)
        self.assertIn("differ in operation", out.stdout)

    def test_unreadable_analysis_and_missing_config_are_not_checked(self):
        (self.root / "bad.json").write_text("{")
        out = subprocess.run([sys.executable, str(SCRIPT), str(self.root / "bad.json"), str(self.root / "bad.json"),
                              "--root", str(self.root)], capture_output=True, text=True, check=False)
        self.assertEqual(out.returncode, 2)
        self.assertIn(SHIELD["project_config"], out.stdout)

    def test_bad_project_schema_fails(self):
        self.project["stack"] = "nes"
        out = self.report([], [])
        self.assertEqual(out.returncode, 1, out.stdout)
        self.assertIn("stack must be one of", out.stdout)


if __name__ == "__main__":
    unittest.main()

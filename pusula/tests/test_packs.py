"""Structure tests for skills/recipes/packs. Standard library only.

They cannot judge whether a fact is true; they stop a pack from losing its date, its sources,
its exit check, its place in the index, or growing past the size rule.
"""
import datetime
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PACKS = ROOT / "skills" / "recipes" / "packs"
RECIPES = ROOT / "skills" / "recipes" / "SKILL.md"
MAX_BYTES = 6 * 1024
REQUIRED = ("## Sources first", "## Traps", "## Checks", "## Done when")
DATE = re.compile(r"Facts read (\d{4}-\d{2}-\d{2})")
URL = re.compile(r"https?://\S+")
LABELS = re.compile(r"\[(official|secondary|common practice|reasoning|unverified|ran)[^\]]*\]")
INDEX_ROW = re.compile(r"^\| .+ \| `([\w-]+\.md)` \| (\d{4}-\d{2}-\d{2}) \|$", re.MULTILINE)
LOCAL_REF = re.compile(r"`([\w-]+/[\w./-]+\.md)`")


def pack_files():
    return sorted(p for p in PACKS.glob("*.md") if p.name != "INDEX.md")


class PackStructure(unittest.TestCase):
    def test_there_are_packs(self):
        self.assertGreaterEqual(len(pack_files()), 12)

    def test_every_pack_has_the_required_parts(self):
        for path in pack_files():
            text = path.read_text(encoding="utf-8")
            with self.subTest(pack=path.name):
                self.assertTrue(text.startswith("# Pack: "), "first line must be '# Pack: <name>'")
                for heading in REQUIRED:
                    self.assertIn(heading, text)
                self.assertTrue(DATE.search(text), "needs 'Facts read YYYY-MM-DD'")
                self.assertTrue(URL.search(text.split("## Traps")[0]), "sources section needs a URL")
                self.assertTrue(LABELS.search(text), "claims need certainty labels")

    def test_size_stays_under_the_rule(self):
        limit = json.loads((ROOT / "checks" / "config.json").read_text(encoding="utf-8"))["max_file_bytes"]
        for path in PACKS.glob("*.md"):
            with self.subTest(pack=path.name):
                self.assertLessEqual(path.stat().st_size, min(MAX_BYTES, limit))

    def test_dates_are_real_and_not_in_the_future(self):
        for path in pack_files():
            found = DATE.search(path.read_text(encoding="utf-8"))
            with self.subTest(pack=path.name):
                day = datetime.date.fromisoformat(found.group(1))
                self.assertLessEqual(day, datetime.date.today())

    def test_local_references_point_at_files_that_exist(self):
        skill_dirs = {p.name for p in (ROOT / "skills").iterdir() if p.is_dir()}
        for path in PACKS.glob("*.md"):
            for ref in LOCAL_REF.findall(path.read_text(encoding="utf-8")):
                head = ref.split("/")[0]
                if head != "packs" and head not in skill_dirs:
                    continue
                target = PACKS / ref.removeprefix("packs/") if head == "packs" else ROOT / "skills" / ref
                with self.subTest(pack=path.name, ref=ref):
                    self.assertTrue(target.is_file(), f"{ref} does not exist")


class PackIndex(unittest.TestCase):
    def setUp(self):
        self.rows = dict(INDEX_ROW.findall((PACKS / "INDEX.md").read_text(encoding="utf-8")))

    def test_every_pack_is_listed_once_and_every_row_has_a_pack(self):
        self.assertEqual(sorted(self.rows), [p.name for p in pack_files()])

    def test_index_date_matches_the_pack_date(self):
        for path in pack_files():
            with self.subTest(pack=path.name):
                self.assertEqual(self.rows.get(path.name), DATE.search(path.read_text(encoding="utf-8")).group(1))

    def test_recipes_router_points_at_the_index(self):
        self.assertIn("packs/INDEX.md", RECIPES.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()

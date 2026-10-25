"""Tests for checks/validate_glb.mjs. Standard library only.

Tests that only need Node run always. Tests that need the npm package gltf-validator run when
PUSULA_TEST_NODE_MODULES points at a node_modules folder that contains it.
"""
import base64
import json
import os
import shutil
import struct
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "checks" / "validate_glb.mjs"
MODULES = os.environ.get("PUSULA_TEST_NODE_MODULES", "")
JSON_CHUNK, BIN_CHUNK, GLB_MAGIC = 0x4E4F534A, 0x004E4942, 0x46546C67
TRIANGLE = struct.pack("<9f", 0, 0, 0, 1, 0, 0, 0, 1, 0)


def triangle_gltf(count=3, embedded=True):
    buffer = {"byteLength": len(TRIANGLE)}
    if embedded:
        buffer["uri"] = "data:application/octet-stream;base64," + base64.b64encode(TRIANGLE).decode()
    return {"asset": {"version": "2.0"}, "scene": 0, "scenes": [{"nodes": [0]}], "nodes": [{"mesh": 0}],
            "meshes": [{"primitives": [{"attributes": {"POSITION": 0}}]}],
            "accessors": [{"bufferView": 0, "componentType": 5126, "count": count, "type": "VEC3",
                           "min": [0, 0, 0], "max": [1, 1, 0]}],
            "bufferViews": [{"buffer": 0, "byteLength": len(TRIANGLE), "target": 34962}], "buffers": [buffer]}


def glb_bytes(gltf):
    text = json.dumps(gltf).encode()
    text += b" " * (-len(text) % 4)
    body = struct.pack("<II", len(text), JSON_CHUNK) + text + struct.pack("<II", len(TRIANGLE), BIN_CHUNK) + TRIANGLE
    return struct.pack("<III", GLB_MAGIC, 2, 12 + len(body)) + body


@unittest.skipUnless(shutil.which("node"), "node not installed")
class GlbCase(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        self.addCleanup(self._tmp.cleanup)

    def run_script(self, *args, modules=MODULES):
        env = {**os.environ, "NODE_PATH": modules}
        return subprocess.run(["node", str(SCRIPT), *args], capture_output=True, text=True, env=env, cwd=self.root, check=False)

    def put(self, name, data):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data if isinstance(data, bytes) else json.dumps(data).encode())
        return str(path)


class NotCheckedCases(GlbCase):
    def test_no_arguments_is_not_checked(self):
        done = self.run_script()
        self.assertEqual(done.returncode, 2, done.stderr)
        self.assertIn("[NOT CHECKED]", done.stderr)

    def test_missing_path_is_not_checked(self):
        done = self.run_script(str(self.root / "nowhere"))
        self.assertEqual(done.returncode, 2, done.stderr)

    def test_missing_validator_package_is_not_checked(self):
        copy = self.root / "tool" / "validate_glb.mjs"
        copy.parent.mkdir()
        shutil.copy(SCRIPT, copy)
        env = {k: v for k, v in os.environ.items() if k != "NODE_PATH"}
        done = subprocess.run(["node", str(copy), str(self.root)], capture_output=True, text=True, env=env, check=False)
        self.assertEqual(done.returncode, 2, done.stdout)
        self.assertIn("gltf-validator is not installed", done.stderr)


@unittest.skipUnless(MODULES, "set PUSULA_TEST_NODE_MODULES to a node_modules folder with gltf-validator")
class ValidatorCases(GlbCase):
    def test_good_gltf_and_glb_pass(self):
        done = self.run_script(self.put("a.gltf", triangle_gltf()), self.put("b.glb", glb_bytes(triangle_gltf(embedded=False))))
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
        self.assertEqual(done.stdout.count("ok  "), 2)

    def test_error_fails_and_names_the_code(self):
        done = self.run_script(self.put("bad.gltf", triangle_gltf(count=99)))
        self.assertEqual(done.returncode, 1, done.stdout)
        self.assertIn("FAIL", done.stdout)
        self.assertIn("ACCESSOR_TOO_LONG", done.stdout)

    def test_unreadable_file_fails_instead_of_crashing(self):
        done = self.run_script(self.put("trash.glb", b"not a glb"))
        self.assertEqual(done.returncode, 1, done.stderr)
        self.assertIn("FAIL", done.stdout)
        self.assertNotIn("triggerUncaughtException", done.stderr)

    def test_folder_is_scanned_recursively_and_one_bad_file_fails_the_run(self):
        self.put("deep/er/good.gltf", triangle_gltf())
        self.put("deep/er/binary.glb", glb_bytes(triangle_gltf(embedded=False)))
        self.put("deep/bad.gltf", triangle_gltf(count=99))
        self.put("deep/readme.txt", b"ignored")
        done = self.run_script(str(self.root))
        self.assertEqual(done.returncode, 1, done.stdout)
        self.assertEqual(done.stdout.count("ok  "), 2, done.stdout)
        self.assertEqual(done.stdout.count("FAIL "), 1, done.stdout)

    def test_external_buffer_is_resolved_next_to_the_file(self):
        self.put("m/data.bin", TRIANGLE)
        model = triangle_gltf(embedded=False)
        model["buffers"][0]["uri"] = "data.bin"
        done = self.run_script(self.put("m/model.gltf", model))
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)


if __name__ == "__main__":
    unittest.main()

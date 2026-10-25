// Validate .glb/.gltf files with the Khronos validator (npm package gltf-validator).
// Usage: node validate_glb.mjs <file-or-folder>...   Exit 0 clean, 1 errors found, 2 not checked.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { createRequire } from "node:module";

const ASSET_EXTENSIONS = new Set([".glb", ".gltf"]);
const NOT_CHECKED = 2;
const FOUND_ERRORS = 1;

function listAssets(target) {
  if (!statSync(target).isDirectory()) return [target];
  return readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const path = join(target, entry.name);
    return entry.isDirectory() ? listAssets(path) : ASSET_EXTENSIONS.has(extname(path)) ? [path] : [];
  });
}

let validator;
try {
  validator = createRequire(import.meta.url)("gltf-validator");
} catch {
  console.error("[NOT CHECKED] npm package gltf-validator is not installed");
  process.exit(NOT_CHECKED);
}

const targets = process.argv.slice(2);
let files = [];
try {
  files = targets.flatMap(listAssets);
} catch (error) {
  console.error(`[NOT CHECKED] ${error.message}`);
  process.exit(NOT_CHECKED);
}
if (!targets.length || !files.length) {
  console.error("[NOT CHECKED] no .glb or .gltf files given or found");
  process.exit(NOT_CHECKED);
}

let failed = false;
for (const file of files) {
  const base = dirname(resolve(file));
  let issues;
  try {
    ({ issues } = await validator.validateBytes(new Uint8Array(readFileSync(file)), {
      uri: file,
      externalResourceFunction: async (uri) => new Uint8Array(readFileSync(join(base, decodeURIComponent(uri)))),
    }));
  } catch (error) {
    failed = true;
    console.log(`FAIL ${file}: ${error.message ?? error}`);
    continue;
  }
  const { numErrors, numWarnings } = issues;
  failed ||= numErrors > 0;
  console.log(`${numErrors > 0 ? "FAIL" : "ok  "} ${file}: ${numErrors} errors, ${numWarnings} warnings`);
  for (const message of issues.messages.filter((m) => m.severity === 0)) console.log(`  ${message.code} ${message.pointer ?? ""}: ${message.message}`);
}
process.exit(failed ? FOUND_ERRORS : 0);

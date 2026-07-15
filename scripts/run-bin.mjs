import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const cwd = process.cwd();
const name = process.argv[2];
const args = process.argv.slice(3);

if (!name) {
  console.error("Usage: node scripts/run-bin.mjs <vite|esbuild> [...args]");
  process.exit(1);
}

const require = createRequire(path.join(cwd, "package.json"));

function resolveBin(binName) {
  const pkgJson = require.resolve(`${binName}/package.json`);
  const root = path.dirname(pkgJson);
  const candidates =
    binName === "vite"
      ? [path.join(root, "bin", "vite.js")]
      : binName === "esbuild"
        ? [path.join(root, "bin", "esbuild"), path.join(root, "bin", "esbuild.exe")]
        : [];

  for (const file of candidates) {
    if (fs.existsSync(file)) return file;
  }

  throw new Error(`Could not find bin for ${binName} under ${root}`);
}

const resolved = resolveBin(name);
const result = spawnSync(process.execPath, [resolved, ...args], {
  cwd,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);

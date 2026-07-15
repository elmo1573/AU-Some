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

function isNativeBinary(file) {
  try {
    const fd = fs.openSync(file, "r");
    const head = Buffer.alloc(4);
    fs.readSync(fd, head, 0, 4, 0);
    fs.closeSync(fd);
    const elf = head[0] === 0x7f && head[1] === 0x45 && head[2] === 0x4c && head[3] === 0x46;
    const mz = head[0] === 0x4d && head[1] === 0x5a;
    return elf || mz;
  } catch {
    return false;
  }
}

const resolved = resolveBin(name);
const runsNative = isNativeBinary(resolved) || path.extname(resolved) === ".exe";
const command = runsNative ? resolved : process.execPath;
const commandArgs = runsNative ? args : [resolved, ...args];

const result = spawnSync(command, commandArgs, {
  cwd,
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);

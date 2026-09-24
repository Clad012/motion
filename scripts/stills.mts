// Renders evenly spaced stills of one composition, to check a video without playing it.
//
//   pnpm stills <CompositionId>                 6 stills into out/stills/<id>/
//   pnpm stills <CompositionId> --count=10 --scale=0.5
//   pnpm stills <CompositionId> --frames=30,120,240
//
// Renders are deterministic: the same code gives byte-identical PNGs, so comparing
// checksums before and after a refactor proves nothing moved.

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name: string): string | null => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : null;
};

const id = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!id) {
  console.error("Usage: pnpm stills <CompositionId> [--count=6] [--scale=0.35] [--frames=a,b,c]");
  process.exit(1);
}
const count = Number(arg("count") ?? 6);
const scale = arg("scale") ?? "0.35";
const bundle = join(ROOT, "out", ".bundle");
const outDir = join(ROOT, "out", "stills", id);
mkdirSync(outDir, { recursive: true });

const remotion = (args: string[]): string =>
  execFileSync("pnpm", ["exec", "remotion", ...args], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

console.log("Bundling…");
remotion(["bundle", "src/index.ts", `--out-dir=${bundle}`, "--log=error"]);

const listing = remotion(["compositions", bundle]);
const row = listing.split("\n").find((line) => line.split(/\s+/)[0] === id);
if (!row) {
  console.error(`No composition "${id}". Run \`pnpm exec remotion compositions\` to list them.`);
  process.exit(1);
}
const duration = Number(row.trim().split(/\s+/)[3]);
const frames = arg("frames")
  ? arg("frames")!.split(",").map(Number)
  : Array.from({ length: count }, (_, i) => Math.min(duration - 1, Math.round(((i + 0.5) / count) * duration)));

for (const frame of frames) {
  const file = join(outDir, `${String(frame).padStart(5, "0")}.png`);
  remotion(["still", bundle, id, file, `--frame=${frame}`, `--scale=${scale}`, "--log=error"]);
  console.log(`  ${file.slice(ROOT.length + 1)}`);
}

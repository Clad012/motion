// Renders evenly spaced stills of one composition, to check a video without playing it.
//
//   pnpm stills <CompositionId>                 6 stills into out/stills/<id>/
//   pnpm stills <CompositionId> --count=10 --scale=0.5
//   pnpm stills <CompositionId> --frames=30,120,240
//
// One bundle, one browser for every frame: much faster than a `remotion still` per
// frame on a small machine.
//
// Renders are deterministic: the same code gives byte-identical PNGs, so comparing
// checksums before and after a refactor proves nothing moved.

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCompositions, openBrowser, renderStill, selectComposition } from "@remotion/renderer";

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
const scale = Number(arg("scale") ?? "0.35");
const bundle = join(ROOT, "out", ".bundle");
const outDir = join(ROOT, "out", "stills", id);
mkdirSync(outDir, { recursive: true });

// The CLI bundles with remotion.config.ts (Rspack, Tailwind, the @/ alias); the
// Node bundler API would ignore that file.
console.log("Bundling…");
execFileSync("pnpm", ["exec", "remotion", "bundle", "src/index.ts", `--out-dir=${bundle}`, "--log=error"], {
  cwd: ROOT,
  stdio: ["ignore", "ignore", "inherit"],
});

// Same as `remotion still`: the scale is the device scale factor, so PNGs match the CLI byte for byte.
const browser = await openBrowser("chrome", { forceDeviceScaleFactor: scale });
try {
  const composition = await selectComposition({ serveUrl: bundle, id, puppeteerInstance: browser }).catch(async () => {
    const ids = (await getCompositions(bundle, { puppeteerInstance: browser })).map((c) => c.id);
    console.error(`No composition "${id}". Compositions: ${ids.join(", ")}`);
    process.exit(1);
  });
  const duration = composition.durationInFrames;
  const frames = arg("frames")
    ? arg("frames")!.split(",").map(Number)
    : Array.from({ length: count }, (_, i) => Math.min(duration - 1, Math.round(((i + 0.5) / count) * duration)));

  for (const frame of frames) {
    const file = join(outDir, `${String(frame).padStart(5, "0")}.png`);
    await renderStill({
      composition,
      serveUrl: bundle,
      output: file,
      frame,
      scale,
      imageFormat: "png",
      puppeteerInstance: browser,
    });
    console.log(`  ${file.slice(ROOT.length + 1)}`);
  }
} finally {
  await browser.close({ silent: true });
}

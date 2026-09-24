// Downloads the assets this repository does not redistribute (third-party files
// whose licence is not documented here). Run once after cloning:
//
//   pnpm assets
//
// Files already present are skipped.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Destination is relative to public/.
const ASSETS: ReadonlyArray<{ readonly url: string; readonly dest: string }> = [
  // Yuniqa music beds (cdn.yuniqa.ai). The CDN sends no CORS headers, so the renderer needs local copies.
  { url: "https://cdn.yuniqa.ai/audio/beats3.mp3", dest: "yuniqa/audio/music/beats3.mp3" },
  { url: "https://cdn.yuniqa.ai/audio/beats4.mp3", dest: "yuniqa/audio/music/beats4.mp3" },
];

let fetched = 0;
for (const asset of ASSETS) {
  const target = join(ROOT, "public", asset.dest);
  if (existsSync(target)) {
    continue;
  }
  const response = await fetch(asset.url);
  if (!response.ok) {
    console.error(`  ${asset.dest}: HTTP ${response.status} from ${asset.url}`);
    process.exitCode = 1;
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, Buffer.from(await response.arrayBuffer()));
  console.log(`  ${asset.dest}`);
  fetched += 1;
}
console.log(fetched ? `Fetched ${fetched} file(s).` : "All assets already present.");

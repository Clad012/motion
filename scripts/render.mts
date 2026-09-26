// Renders one video to an MP4, then checks the file without looking at it.
//
//   pnpm render <Id>                      out/<Id>.mp4, full quality
//   pnpm render <Id> --draft              out/<Id>-draft.mp4, half size, faster
//   pnpm render <Id> --frames=300-420     out/<Id>-300-420.mp4, only those frames
//   pnpm render <Id> --allow-silent       render a scripted video that has no voice yet
//
// Other flags go to `remotion render` as they are (--concurrency=1, --crf=18…).
// A video with a script but no generated voice is refused: it would come out silent.
// After rendering, ffprobe checks the length, the size and that there is sound.

import { execFileSync, spawnSync } from "node:child_process";
import { join, relative } from "node:path";
import { ROOT, findVideo, voiceState } from "./lib/videos.mts";

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--"));
if (!id) {
  console.error("Usage: pnpm render <CompositionId> [--draft] [--frames=a-b] [--allow-silent] [remotion flags]");
  process.exit(1);
}
const draft = args.includes("--draft");
const allowSilent = args.includes("--allow-silent");
const frames = args.find((a) => a.startsWith("--frames="))?.slice("--frames=".length);
const passThrough = args.filter((a) => a !== id && a !== "--draft" && a !== "--allow-silent");

const video = findVideo(id);
let voiced = false;
if (video?.hasScript) {
  const state = await voiceState(video);
  voiced = state.kind === "voiced";
  if (!voiced && !allowSilent) {
    const why =
      state.kind === "silent"
        ? `it has no voice yet. Run: pnpm voiceover --video=${video.id}`
        : state.kind === "mismatch"
          ? `its voice does not match script.ts. Run: pnpm lint`
          : `audio files are missing. Run: pnpm lint`;
    console.error(`Not rendering ${id}: ${why}\n(--allow-silent renders it anyway.)`);
    process.exit(1);
  }
}

const suffix = draft ? "-draft" : frames ? `-${frames.replace(/[^0-9-]/g, "")}` : "";
const output = join(ROOT, "out", `${id}${suffix}.mp4`);
const draftFlags = draft && !passThrough.some((a) => a.startsWith("--scale=")) ? ["--scale=0.5", "--crf=28"] : [];

const started = Date.now();
const render = spawnSync(
  "pnpm",
  ["exec", "remotion", "render", "src/index.ts", id, output, ...draftFlags, ...passThrough],
  { cwd: ROOT, stdio: "inherit" },
);
if (render.status !== 0) process.exit(render.status ?? 1);

// Check the file: length, size, sound.
const probe = (): { durationS: number; width: number; height: number; audio: boolean } => {
  const probeArgs = [
    "-v",
    "error",
    "-show_entries",
    "format=duration:stream=codec_type,width,height",
    "-of",
    "json",
    output,
  ];
  let json: string;
  try {
    json = execFileSync("ffprobe", probeArgs, { encoding: "utf8" });
  } catch {
    json = execFileSync("pnpm", ["exec", "remotion", "ffprobe", ...probeArgs], { cwd: ROOT, encoding: "utf8" });
  }
  const info = JSON.parse(json) as {
    format: { duration: string };
    streams: Array<{ codec_type: string; width?: number; height?: number }>;
  };
  const picture = info.streams.find((s) => s.codec_type === "video");
  return {
    durationS: Number.parseFloat(info.format.duration),
    width: picture?.width ?? 0,
    height: picture?.height ?? 0,
    audio: info.streams.some((s) => s.codec_type === "audio"),
  };
};
const file = probe();
const took = ((Date.now() - started) / 1000).toFixed(0);
console.log(
  `\n${relative(ROOT, output)}: ${file.durationS.toFixed(1)} s, ${file.width}×${file.height}, ` +
    `sound: ${file.audio ? "yes" : "NO"} (rendered in ${took} s)`,
);
if (voiced && !file.audio) {
  console.error("✖ The video has a voiceover but the file has no sound.");
  process.exit(1);
}

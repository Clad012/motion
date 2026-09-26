// Part of `pnpm lint`: every video's voice must fit its script.
//
// Fails when generated/voiceover.json no longer matches script.ts (a scene was
// added, renamed or moved) or when an audio file it points to is missing. Warns
// about videos that still render silent because no voice was generated yet.

import { TEMPLATES, listVideos, voiceState } from "./lib/videos.mts";

let failed = false;
for (const video of listVideos().filter((v) => v.hasScript)) {
  const name = `${video.project}/${video.id}`;
  const state = await voiceState(video);
  if (state.kind === "mismatch") {
    failed = true;
    const voiced = new Set(state.voiceover);
    const unvoiced = state.script.filter((id) => !voiced.has(id));
    console.error(
      `✖ ${name}: voiceover.json does not match script.ts\n` +
        `    script:    ${state.script.join(", ")}\n` +
        `    voiceover: ${state.voiceover.join(", ")}\n` +
        `    fix: pnpm voiceover --video=${video.id}${unvoiced.length > 0 ? ` --only=${unvoiced.join(",")}` : ""}`,
    );
  } else if (state.kind === "missing-audio") {
    failed = true;
    console.error(`✖ ${name}: audio missing: ${state.files.join(", ")}`);
  } else if (state.kind === "silent" && !TEMPLATES.has(name)) {
    console.warn(`! ${name}: no voice yet, renders SILENT. Run: pnpm voiceover --video=${video.id}`);
  }
}
if (failed) process.exit(1);

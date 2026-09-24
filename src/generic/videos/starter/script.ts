// Starter — the smallest complete video: three scenes, one idea each.
// Copy this folder to begin a new video, or run `pnpm new-video --project=<p> --id=<id>`.
// Keep this file free of React imports: scripts/voiceover.mts reads it from Node.
import type { ScriptLine } from "../../engine/voiceover.ts";

/** ElevenLabs premade voice "George" (English). Any voice id from your account works. */
export const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export const SCRIPT: ScriptLine[] = [
  { id: "hook", voice: "Three scenes. One idea each. That is a whole video.", tailMs: 300 },
  { id: "steps", voice: "Write the lines, draw each scene, and let the voice set the timing.", tailMs: 400 },
  {
    id: "end",
    voice: "Until you generate the voice, it plays silent, with captions timed from the text.",
    tailMs: 900,
  },
];

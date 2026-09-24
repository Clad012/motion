// Top 5 prompts to use with Claude — a countdown, not tied to any brand.
// Each prompt is typed into a chat on a real phone, and the answer shows the payoff.
// Keep this file free of React imports: scripts/voiceover.mts reads it from Node.
import type { ScriptLine } from "../../engine/voiceover.ts";

/** ElevenLabs premade voice "George" (English). */
export const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export const SCRIPT: ScriptLine[] = [
  {
    id: "hook",
    voice: "Five Claude prompts that actually save me time. Number one is the one nobody uses.",
    tailMs: 300,
  },
  { id: "p5", voice: "Five. Cut this email in half, and keep every fact. Short emails get answered.", tailMs: 700 },
  {
    id: "p4",
    voice: "Four. Ask for the twenty percent that gives eighty percent of the results. You skip the noise.",
    tailMs: 700,
  },
  { id: "p3", voice: "Three. Paste your messy brain dump, and ask for a plan with time estimates.", tailMs: 900 },
  { id: "p2", voice: "Two. Explain it simply, then quiz me. That is how it actually sticks.", tailMs: 900 },
  {
    id: "p1",
    voice:
      "Number one. Assume my launch failed. What are the three most likely reasons? Now fix them before they happen.",
    tailMs: 700,
  },
  { id: "end", voice: "Save this, and try number one tonight.", tailMs: 900 },
];

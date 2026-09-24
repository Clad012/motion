// Top 5 prompts to use with Claude — a countdown, not tied to any brand.
// Each prompt is typed into a chat on a real phone and answered.
// Keep this file free of React imports: scripts/voiceover.mts reads it from Node.
import type { ScriptLine } from "../../engine/voiceover.ts";

/** ElevenLabs premade voice "George" (English). */
export const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export const SCRIPT: ScriptLine[] = [
  { id: "hook", voice: "Five prompts that make Claude way more useful. Number one changes everything.", tailMs: 300 },
  { id: "p5", voice: "Number five. Ask me questions until you have enough context.", tailMs: 500 },
  { id: "p4", voice: "Four. List your assumptions before you answer.", tailMs: 500 },
  { id: "p3", voice: "Three. Give me three options, then pick one and say why.", tailMs: 500 },
  { id: "p2", voice: "Two. Review your own answer like a strict editor, then fix it.", tailMs: 500 },
  { id: "p1", voice: "And number one. Here is an example of what I want. Match it.", tailMs: 600 },
  { id: "end", voice: "Save this for your next chat. Follow for more.", tailMs: 900 },
];

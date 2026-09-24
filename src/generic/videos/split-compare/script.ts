// Split compare — two answers to the same request, stacked: the muted one on top,
// the lit one below. Built from SplitStage, BigStat, PanelRow and SeamBadge.
// Keep this file free of React imports: scripts/voiceover.mts reads it from Node.
import type { ScriptLine } from "../../engine/voiceover.ts";

/** ElevenLabs premade voice "George" (English). */
export const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export const SCRIPT: ScriptLine[] = [
  { id: "hook", voice: "Same request, two assistants. Only one does the work.", tailMs: 300 },
  { id: "before", voice: "The first one sends ten tips, and leaves the work to you.", tailMs: 300 },
  { id: "after", voice: "The second one opens the inbox, clears it, and books the call.", tailMs: 400 },
  { id: "verdict", voice: "One talks. The other acts.", tailMs: 500 },
  { id: "end", voice: "Pick the one that acts.", tailMs: 900 },
];

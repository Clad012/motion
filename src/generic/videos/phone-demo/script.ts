// Phone demo — a product shown the way it is used: a real phone, close, on a real desk.
// Built from CloseUpStage (the device on a photographed room) and ChatScreen.
// Keep this file free of React imports: scripts/voiceover.mts reads it from Node.
import type { ScriptLine } from "../../engine/voiceover.ts";

/** ElevenLabs premade voice "George" (English). */
export const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export const SCRIPT: ScriptLine[] = [
  { id: "hook", voice: "Two hundred unread emails. One message fixes it.", tailMs: 300 },
  { id: "ask", voice: "I type: sort my inbox, and turn what matters into tasks.", tailMs: 300 },
  {
    id: "answer",
    voice: "Twelve seconds later: read, archived, and three tasks with the right deadlines.",
    tailMs: 500,
  },
  { id: "end", voice: "Swap the words, keep the phone. Link in bio.", tailMs: 900 },
];

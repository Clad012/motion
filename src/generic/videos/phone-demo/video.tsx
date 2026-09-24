import { defineVideo, neutralTheme, type VoiceoverManifest } from "../../engine";
import manifest from "./generated/voiceover.json";
import { AnswerScene, AskScene, EndScene, HookScene } from "./scenes";
import { SCRIPT } from "./script";

export const video = defineVideo({
  id: "PhoneDemo",
  angle: "Template: a real phone close up on a photographed desk, a chat that does the work",
  theme: neutralTheme,
  script: SCRIPT,
  manifest: manifest as VoiceoverManifest,
  scenes: { hook: HookScene, ask: AskScene, answer: AnswerScene, end: EndScene },
  music: null,
});

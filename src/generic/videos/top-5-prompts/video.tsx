import { defineVideo, neutralTheme, type VoiceoverManifest } from "@/generic/engine";
import manifest from "./generated/voiceover.json";
import { EndScene, HookScene, PROMPT_SCENES } from "./scenes";
import { SCRIPT } from "./script";

export const video = defineVideo({
  id: "Top5Prompts",
  angle: "Countdown of five prompts that make Claude more useful, typed on a real phone",
  theme: neutralTheme,
  script: SCRIPT,
  manifest: manifest as VoiceoverManifest,
  scenes: { hook: HookScene, ...PROMPT_SCENES, end: EndScene },
  music: null,
});

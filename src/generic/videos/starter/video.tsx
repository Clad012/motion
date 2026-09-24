import { defineVideo, neutralTheme, type VoiceoverManifest } from "../../engine";
import manifest from "./generated/voiceover.json";
import { EndScene, HookScene, StepsScene } from "./scenes";
import { SCRIPT } from "./script";

export const video = defineVideo({
  id: "Starter",
  angle: "Template: three scenes, silent until a voiceover is generated",
  theme: neutralTheme,
  script: SCRIPT,
  manifest: manifest as VoiceoverManifest,
  scenes: { hook: HookScene, steps: StepsScene, end: EndScene },
  music: null,
});

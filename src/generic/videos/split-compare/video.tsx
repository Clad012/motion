import { defineVideo, neutralTheme, type VoiceoverManifest } from "../../engine";
import manifest from "./generated/voiceover.json";
import { AfterScene, BeforeScene, EndScene, HookScene, VerdictScene } from "./scenes";
import { SCRIPT } from "./script";

export const video = defineVideo({
  id: "SplitCompare",
  angle: "Template: two answers to the same request, stacked, one muted and one lit",
  theme: neutralTheme,
  script: SCRIPT,
  manifest: manifest as VoiceoverManifest,
  scenes: { hook: HookScene, before: BeforeScene, after: AfterScene, verdict: VerdictScene, end: EndScene },
  music: null,
});

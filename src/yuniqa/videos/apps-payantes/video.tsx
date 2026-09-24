import "../../../index.css";
import manifest from "./generated/voiceover.json";
import { VideoShell } from "@/generic/engine";
import { SceneWithVoice } from "@/generic/engine";
import { buildTimeline, totalDuration, type SceneMap, type TimelineScene } from "@/generic/engine";
import type { VoiceoverManifest } from "@/generic/engine";
import { HookScene } from "./scenes/HookScene";
import { PileScene } from "./scenes/PileScene";
import { TurnScene } from "./scenes/TurnScene";
import { DemoMailScene } from "./scenes/DemoMailScene";
import { DemoRapidScene } from "./scenes/DemoRapidScene";
import { DemoSubsScene } from "./scenes/DemoSubsScene";
import { DemoSleepScene } from "./scenes/DemoSleepScene";
import { RevealScene } from "./scenes/RevealScene";
import { CtaScene } from "./scenes/CtaScene";

const SCENES: SceneMap = {
  hook: HookScene,
  pile: PileScene,
  turn: TurnScene,
  "demo-mail": DemoMailScene,
  "demo-rapid": DemoRapidScene,
  "demo-subs": DemoSubsScene,
  "demo-sleep": DemoSleepScene,
  reveal: RevealScene,
  cta: CtaScene,
};

export const TIMELINE = buildTimeline(manifest as VoiceoverManifest);
export const DURATION_IN_FRAMES = totalDuration(TIMELINE);

export const AppsPayantesVideo: React.FC = () => <VideoShell timeline={TIMELINE} scenes={SCENES} />;

export const AppsPayantesScene: React.FC<{ readonly scene: TimelineScene }> = ({ scene }) => (
  <SceneWithVoice scene={scene} scenes={SCENES} />
);

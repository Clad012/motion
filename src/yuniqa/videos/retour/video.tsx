import "../../../index.css";
import manifest from "./generated/voiceover.json";
import { SceneWithVoice } from "@/generic/engine";
import { VideoShell } from "@/generic/engine";
import { SplitCta } from "@/yuniqa/components";
import { buildTimeline, totalDuration, type SceneMap, type TimelineScene } from "@/generic/engine";
import type { VoiceoverManifest } from "@/generic/engine";
import {
  ActionsScene,
  AttentionScene,
  BasculeScene,
  BriefScene,
  ChaosScene,
  HookScene,
  RevealScene,
  TraiteScene,
  TriScene,
  VerdictScene,
} from "./scenes/scenes";

const SCENES: SceneMap = {
  hook: HookScene,
  chaos: ChaosScene,
  tri: TriScene,
  bascule: BasculeScene,
  brief: BriefScene,
  traite: TraiteScene,
  attention: AttentionScene,
  actions: ActionsScene,
  verdict: VerdictScene,
  reveal: RevealScene,
  cta: (props) => <SplitCta {...props} lines={["Pars tranquille", "ce week-end."]} firstWord="pars" />,
};

// Two seconds of silence first: the lock screen fills up before anyone speaks.
export const TIMELINE = buildTimeline(manifest as VoiceoverManifest, { leadInMs: 2000 });
export const DURATION_IN_FRAMES = totalDuration(TIMELINE);

export const RetourVideo: React.FC = () => (
  <VideoShell timeline={TIMELINE} scenes={SCENES} musicFile="yuniqa/audio/music/beats4.mp3" musicVolume={0.07} />
);

export const RetourScene: React.FC<{ readonly scene: TimelineScene }> = ({ scene }) => (
  <SceneWithVoice scene={scene} scenes={SCENES} />
);

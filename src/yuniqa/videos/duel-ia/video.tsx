import "../../../index.css";
import manifest from "./generated/voiceover.json";
import { SceneWithVoice } from "@/generic/engine";
import { VideoShell } from "@/generic/engine";
import { SplitCta } from "@/yuniqa/components";
import { buildTimeline, totalDuration, type SceneMap, type TimelineScene } from "@/generic/engine";
import type { VoiceoverManifest } from "@/generic/engine";
import {
  DroiteScene,
  GaucheScene,
  HookScene,
  QuestionScene,
  RevealScene,
  Round2ResultatScene,
  Round2Scene,
  VerdictScene,
} from "./scenes/scenes";

const SCENES: SceneMap = {
  hook: HookScene,
  question: QuestionScene,
  gauche: GaucheScene,
  droite: DroiteScene,
  round2: Round2Scene,
  "round2-resultat": Round2ResultatScene,
  verdict: VerdictScene,
  reveal: RevealScene,
  cta: (props) => <SplitCta {...props} lines={["Arrête de tout", "réexpliquer."]} firstWord="arrete" />,
};

export const TIMELINE = buildTimeline(manifest as VoiceoverManifest);
export const DURATION_IN_FRAMES = totalDuration(TIMELINE);

export const DuelIaVideo: React.FC = () => (
  <VideoShell timeline={TIMELINE} scenes={SCENES} musicFile="yuniqa/audio/music/beats4.mp3" musicVolume={0.08} />
);

export const DuelIaScene: React.FC<{ readonly scene: TimelineScene }> = ({ scene }) => (
  <SceneWithVoice scene={scene} scenes={SCENES} />
);

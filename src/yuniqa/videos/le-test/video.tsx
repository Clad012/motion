import "../../../index.css";
import manifest from "./generated/voiceover.json";
import { VideoShell } from "@/generic/engine";
import { SceneWithVoice } from "@/generic/engine";
import { buildTimeline, totalDuration, type SceneMap, type TimelineScene } from "@/generic/engine";
import type { VoiceoverManifest } from "@/generic/engine";
import { HookScene } from "./scenes/HookScene";
import { QuestionScene } from "./scenes/QuestionScene";
import { Reponse1Scene } from "./scenes/Reponse1Scene";
import { Reponse2Scene } from "./scenes/Reponse2Scene";
import { Round2Scene } from "./scenes/Round2Scene";
import { Round2ResultatScene } from "./scenes/Round2ResultatScene";
import { VerdictScene } from "./scenes/VerdictScene";
import { RevealScene } from "./scenes/RevealScene";
import { CtaScene } from "./scenes/CtaScene";

const SCENES: SceneMap = {
  hook: HookScene,
  question: QuestionScene,
  "reponse-1": Reponse1Scene,
  "reponse-2": Reponse2Scene,
  round2: Round2Scene,
  "round2-resultat": Round2ResultatScene,
  verdict: VerdictScene,
  reveal: RevealScene,
  cta: CtaScene,
};

export const TIMELINE = buildTimeline(manifest as VoiceoverManifest);
export const DURATION_IN_FRAMES = totalDuration(TIMELINE);

export const LeTestVideo: React.FC = () => (
  <VideoShell timeline={TIMELINE} scenes={SCENES} musicFile="yuniqa/audio/music/beats4.mp3" musicVolume={0.07} />
);

export const LeTestScene: React.FC<{ readonly scene: TimelineScene }> = ({ scene }) => (
  <SceneWithVoice scene={scene} scenes={SCENES} />
);

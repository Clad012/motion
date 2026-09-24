import type { VideoEntry } from "@/generic/engine";
import { yuniqaTheme } from "./theme";
// @new-video-import
import {
  AppsPayantesScene,
  AppsPayantesVideo,
  DURATION_IN_FRAMES as appsPayantesDuration,
  TIMELINE as appsPayantesTimeline,
} from "./videos/apps-payantes/video";
import {
  LeTestScene,
  LeTestVideo,
  DURATION_IN_FRAMES as leTestDuration,
  TIMELINE as leTestTimeline,
} from "./videos/le-test/video";
import {
  DuelIaScene,
  DuelIaVideo,
  DURATION_IN_FRAMES as duelIaDuration,
  TIMELINE as duelIaTimeline,
} from "./videos/duel-ia/video";
import {
  RetourScene,
  RetourVideo,
  DURATION_IN_FRAMES as retourDuration,
  TIMELINE as retourTimeline,
} from "./videos/retour/video";

// Every Yuniqa video, as Root.tsx registers it. To add one:
//   pnpm new-video --project=yuniqa --id=<kebab-id>
const ENTRIES: Array<Omit<VideoEntry, "theme">> = [
  // @new-video-entry
  {
    id: "Retour",
    angle: "Problème puis solution : revenir à une boîte en feu, ou au brief « pendant votre absence »",
    Component: RetourVideo,
    SceneComponent: RetourScene,
    timeline: retourTimeline,
    durationInFrames: retourDuration,
  },
  {
    id: "DuelIA",
    angle: "Duel sur deux iPhone : la même question envoyée à deux IA en même temps",
    Component: DuelIaVideo,
    SceneComponent: DuelIaScene,
    timeline: duelIaTimeline,
    durationInFrames: duelIaDuration,
  },
  {
    id: "LeTest",
    angle: "Comparatif écran partagé : une IA qui répond contre une IA qui agit",
    Component: LeTestVideo,
    SceneComponent: LeTestScene,
    timeline: leTestTimeline,
    durationInFrames: leTestDuration,
  },
  {
    id: "AppsPayantes",
    angle: "Fatigue des abonnements : six apps payantes remplacées par une seule",
    Component: AppsPayantesVideo,
    SceneComponent: AppsPayantesScene,
    timeline: appsPayantesTimeline,
    durationInFrames: appsPayantesDuration,
  },
];

export const YUNIQA_VIDEOS: VideoEntry[] = ENTRIES.map((entry) => ({ ...entry, theme: yuniqaTheme }));

// Single source of truth for the video script.
// `voice` is what ElevenLabs reads (French, oral register, numbers spelled out).
// Scenes are ordered; the brand name only appears in the last two scenes.
// This file must stay free of Remotion imports: scripts/generate-voiceover.ts imports it from Node.
import { VOICES } from "../../voices.ts";

/** ElevenLabs voice read by `pnpm voiceover --video=apps-payantes`. */
export const VOICE_ID = VOICES.leo;
export const LANGUAGE_CODE = "fr";

export type SceneId =
  | "hook"
  | "pile"
  | "turn"
  | "demo-mail"
  | "demo-rapid"
  | "demo-subs"
  | "demo-sleep"
  | "reveal"
  | "cta";

export type ScriptScene = {
  id: SceneId;
  voice: string;
  /** Silence kept on screen after the voice line ends (ms). */
  tailMs: number;
};

export const SCRIPT: ScriptScene[] = [
  {
    id: "hook",
    voice:
      "Regarde ton téléphone. Six apps payantes. Cinquante euros par mois. Pour des apps que t'ouvres jamais.",
    tailMs: 300,
  },
  {
    id: "pile",
    voice:
      "Une pour les tâches. Une pour les notes. Une pour le budget. Une pour les repas. Et une IA qui te répond… mais qui fait rien.",
    tailMs: 350,
  },
  {
    id: "turn",
    voice:
      "Et si tout ça tenait dans une seule app ? Une app qui se souvient, qui surveille, et qui agit à ta place.",
    tailMs: 300,
  },
  {
    id: "demo-mail",
    voice:
      "Tu lui dis : résume mes mails d'aujourd'hui, et transforme-les en tâches. C'est fait.",
    tailMs: 400,
  },
  {
    id: "demo-rapid",
    voice:
      "Préviens-moi quand ce prix baisse. Ajoute cette dépense. Planifie mes repas de la semaine.",
    tailMs: 400,
  },
  {
    id: "demo-subs",
    voice:
      "Et pendant qu'il range tes dépenses, il repère tes abonnements : il les liste tous, te prévient avant chaque prélèvement, et te dit lesquels annuler.",
    tailMs: 400,
  },
  {
    id: "demo-sleep",
    voice:
      "Et pendant que tu dors, il trie ta boîte mail, et te remonte seulement ce qui compte.",
    tailMs: 350,
  },
  {
    id: "reveal",
    voice: "Une app. Un abonnement. Ça s'appelle Yuniqa.",
    tailMs: 900,
  },
  {
    id: "cta",
    voice: "Teste-le maintenant. Le lien est en bio.",
    tailMs: 1200,
  },
];

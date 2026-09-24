// Video 3 — "Le test" : écran partagé, même question posée à deux IA.
// La marque n'apparaît qu'aux deux dernières scènes.
// Ce fichier ne doit contenir aucun import Remotion : le générateur de voix l'importe depuis Node.
import { VOICES } from "../../voices.ts";

/** ElevenLabs voice read by `pnpm voiceover --video=le-test`. */
export const VOICE_ID = VOICES.leo;
export const LANGUAGE_CODE = "fr";

export type SceneId =
  | "hook"
  | "question"
  | "reponse-1"
  | "reponse-2"
  | "round2"
  | "round2-resultat"
  | "verdict"
  | "reveal"
  | "cta";

export type ScriptScene = {
  id: SceneId;
  voice: string;
  tailMs: number;
};

export const SCRIPT: ScriptScene[] = [
  {
    id: "hook",
    voice: "J'ai posé la même question à deux IA. Une seule a fait le travail.",
    tailMs: 300,
  },
  {
    id: "question",
    voice: "La question : trie ma boîte mail, et transforme-la en tâches.",
    tailMs: 300,
  },
  {
    id: "reponse-1",
    voice:
      "La première me sort dix conseils. Créez des dossiers. Utilisez des filtres. J'ai pas demandé un cours.",
    tailMs: 350,
  },
  {
    id: "reponse-2",
    voice:
      "La deuxième a ouvert ma boîte. Douze mails lus. Neuf archivés. Trois tâches créées.",
    tailMs: 400,
  },
  {
    id: "round2",
    voice: "Deuxième question : préviens-moi si ce prix baisse.",
    tailMs: 300,
  },
  {
    id: "round2-resultat",
    voice:
      "La première : je n'ai pas accès à internet. La deuxième : alerte posée, elle surveille toute seule.",
    tailMs: 400,
  },
  {
    id: "verdict",
    voice: "L'une parle. L'autre agit.",
    tailMs: 500,
  },
  {
    id: "reveal",
    voice: "Celle qui agit, c'est Yuniqa.",
    tailMs: 900,
  },
  {
    id: "cta",
    voice: "Fais le test toi-même. Le lien est en bio.",
    tailMs: 1200,
  },
];

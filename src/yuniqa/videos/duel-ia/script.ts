// « Duel IA » — deux iPhone côte à côte, la même question envoyée aux deux.
// Hook conçu pour la première seconde : enjeu annoncé avant toute explication.
// Aucun import Remotion ici : le générateur de voix importe ce fichier depuis Node.
import { VOICES } from "../../voices.ts";

/** ElevenLabs voice read by `pnpm voiceover --video=duel-ia`. */
export const VOICE_ID = VOICES.leo;
export const LANGUAGE_CODE = "fr";

export type SceneId =
  | "hook"
  | "question"
  | "gauche"
  | "droite"
  | "round2"
  | "round2-resultat"
  | "verdict"
  | "reveal"
  | "cta";

export type ScriptScene = { id: SceneId; voice: string; tailMs: number };

export const SCRIPT: ScriptScene[] = [
  {
    id: "hook",
    voice: "Deux IA. La même question. L'une va te faire perdre dix minutes, l'autre non.",
    tailMs: 250,
  },
  { id: "question", voice: "J'envoie sur les deux en même temps : on mange quoi ce soir ?", tailMs: 250 },
  {
    id: "gauche",
    voice: "À gauche : donnez-moi vos préférences, vos allergies, et ce qu'il y a dans votre frigo.",
    tailMs: 300,
  },
  {
    id: "droite",
    voice: "À droite : allergique aux fruits de mer, il te reste du poulet, douze euros de budget. Voilà ton dîner.",
    tailMs: 350,
  },
  { id: "round2", voice: "Deuxième message, encore plus vague : relance le client.", tailMs: 250 },
  {
    id: "round2-resultat",
    voice: "À gauche : quel client ? À droite : Marc, devis du douze, six jours sans réponse. Le mail est écrit.",
    tailMs: 400,
  },
  { id: "verdict", voice: "L'une te demande qui tu es. L'autre le sait déjà.", tailMs: 450 },
  { id: "reveal", voice: "Celle de droite, c'est Yuniqa.", tailMs: 900 },
  { id: "cta", voice: "Arrête de tout réexpliquer. Le lien est en bio.", tailMs: 1100 },
];

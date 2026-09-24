// « Bon retour » — le problème (revenir à une boîte mail en feu) puis la solution
// (le brief « voici ce qui s'est passé pendant votre absence »).
// Copie alignée sur l'app : « Pendant votre absence », « requièrent votre attention »,
// « traités pendant votre sommeil ». La marque n'apparaît qu'aux deux dernières scènes.
// Aucun import Remotion ici : le générateur de voix importe ce fichier depuis Node.
import { VOICES } from "../../voices.ts";

/** ElevenLabs voice read by `pnpm voiceover --video=retour`. */
export const VOICE_ID = VOICES.leo;
export const LANGUAGE_CODE = "fr";

export type SceneId =
  | "hook"
  | "chaos"
  | "tri"
  | "bascule"
  | "brief"
  | "traite"
  | "attention"
  | "actions"
  | "verdict"
  | "reveal"
  | "cta";

export type ScriptScene = { id: SceneId; voice: string; tailMs: number };

export const SCRIPT: ScriptScene[] = [
  { id: "hook", voice: "Tu coupes ton téléphone deux jours. Regarde ce qui t'attend au retour.", tailMs: 250 },
  { id: "chaos", voice: "Deux cent trente mails. Quatorze notifs. Et l'urgent, noyé au milieu.", tailMs: 300 },
  { id: "tri", voice: "Et tu passes ton dimanche soir à trier.", tailMs: 350 },
  { id: "bascule", voice: "Même week-end. Même boîte mail. Mais cette fois, quelqu'un a veillé.", tailMs: 300 },
  { id: "brief", voice: "Bon retour. Voici ce qui s'est passé pendant ton absence.", tailMs: 300 },
  {
    id: "traite",
    voice: "Deux cent douze mails traités pendant que tu dormais. Neuf factures classées. Trois abonnements surveillés.",
    tailMs: 300,
  },
  { id: "attention", voice: "Et seulement trois choses demandent ta réponse.", tailMs: 300 },
  {
    id: "actions",
    voice: "Marc attend le devis, la réponse est déjà rédigée. Netflix augmente. Une tâche en retard. Deux minutes, c'est réglé.",
    tailMs: 400,
  },
  { id: "verdict", voice: "Deux heures de tri. Ou deux minutes.", tailMs: 450 },
  { id: "reveal", voice: "Ça s'appelle Yuniqa.", tailMs: 900 },
  { id: "cta", voice: "Pars tranquille ce week-end. Le lien est en bio.", tailMs: 1100 },
];

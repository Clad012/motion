import type { ChatMessage } from "@/generic/components/chat";

/** Marks a message as already on screen when a scene starts. */
export const past = (message: ChatMessage): ChatMessage => ({ ...message, from: -200, typingFor: 0 });

export const ASK_DINNER = "on mange quoi ce soir ?";
export const ASK_CLIENT = "relance le client";

export const LEFT_DINNER_REPLY =
  "Pour vous aider, indiquez-moi vos préférences alimentaires, vos allergies et les ingrédients dont vous disposez.";

export const RIGHT_DINNER_REPLY =
  "Poulet aux courgettes, 22 min. Sans fruits de mer (ton allergie), et tu restes dans tes 12 € de budget.";

export const LEFT_CLIENT_REPLY = "De quel client parlez-vous ? Pouvez-vous préciser le contexte ?";

export const RIGHT_CLIENT_REPLY =
  "Marc Ferrand, devis n° 214 envoyé le 12, sans réponse depuis 6 jours. Relance rédigée, prête à envoyer.";

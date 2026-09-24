// What appears on the phone for each rank: the prompt as typed, and an answer that shows the payoff.
export type RankedPrompt = {
  readonly id: "p5" | "p4" | "p3" | "p2" | "p1";
  readonly rank: number;
  readonly prompt: string;
  /** Newlines are kept in the bubble. */
  readonly reply: string;
};

export const PROMPTS: readonly RankedPrompt[] = [
  {
    id: "p5",
    rank: 5,
    prompt: "Cut this email in half. Keep every fact, date and number.",
    reply: "Done: 142 → 64 words.\nNothing lost: 3 dates, 2 prices, 1 deadline.",
  },
  {
    id: "p4",
    rank: 4,
    prompt: "What's the 20% of learning Spanish that gives 80% of the results?",
    reply: "1. The 1,000 most common words\n2. Present tense only, month one\n3. 20 min of podcasts a day",
  },
  {
    id: "p3",
    rank: 3,
    prompt: "Here's my brain dump. Turn it into a plan for this week, with time estimates.",
    reply: "Mon · finish the deck (2 h)\nTue · call the bank (15 min)\nWed · invoices (1 h)\nDrop · the logo redesign",
  },
  {
    id: "p2",
    rank: 2,
    prompt: "Explain compound interest simply, then quiz me with 3 questions.",
    reply: "It's interest earning interest.\nQ1: €1,000 at 5% for 2 years. How much do you have?",
  },
  {
    id: "p1",
    rank: 1,
    prompt: "Assume my launch failed in 6 months. What are the 3 most likely reasons?",
    reply: "1. Nobody paid before you built it\n2. Price too low to cover ads\n3. People quit at onboarding step 2",
  },
];

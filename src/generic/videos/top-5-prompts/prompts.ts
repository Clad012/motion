// What appears on the phone for each rank: the prompt as typed, and the start of the answer.
export type RankedPrompt = {
  readonly id: "p5" | "p4" | "p3" | "p2" | "p1";
  readonly rank: number;
  /** Spoken word the prompt is sent on. */
  readonly sendOn: string;
  readonly prompt: string;
  readonly reply: string;
};

export const PROMPTS: readonly RankedPrompt[] = [
  {
    id: "p5",
    rank: 5,
    sendOn: "ask",
    prompt: "Ask me questions one at a time until you have enough context, then do the task.",
    reply: "Sure. First question: who is this for?",
  },
  {
    id: "p4",
    rank: 4,
    sendOn: "list",
    prompt: "Before you answer, list the assumptions you're making.",
    reply: "Assumptions: 1. The readers are beginners. 2. You want it under 200 words.",
  },
  {
    id: "p3",
    rank: 3,
    sendOn: "give",
    prompt: "Give me 3 options with trade-offs, then recommend one.",
    reply: "A is fastest, B is cheapest, C scales best. I'd pick B, here's why…",
  },
  {
    id: "p2",
    rank: 2,
    sendOn: "review",
    prompt: "Review your answer like a strict editor, then fix what's weak.",
    reply: "Two weak spots: a vague intro, and point 3 repeats point 1. Fixed version below.",
  },
  {
    id: "p1",
    rank: 1,
    sendOn: "example",
    prompt: "Here's an example of what I want. Match its format and tone.",
    reply: "Got it: same structure, same tone. Here's yours.",
  },
];

import { createNamedSfx } from "./components/audio";

// A small, brand-free sound bank for the generic templates (files in public/generic/sfx).
// Levels are relative to a voice at 1 and stay well under it.
export const GENERIC_SOUNDS = {
  sweep: { file: "generic/sfx/sweep.mp3", volume: 0.12 },
  tap: { file: "generic/sfx/tap.mp3", volume: 0.1 },
  cardIn: { file: "generic/sfx/card-in.mp3", volume: 0.13 },
  confirm: { file: "generic/sfx/confirm.mp3", volume: 0.13 },
  ping: { file: "generic/sfx/ping.mp3", volume: 0.12 },
  pop: { file: "generic/sfx/pop.mp3", volume: 0.1 },
  whoosh: { file: "generic/sfx/whoosh.mp3", volume: 0.14 },
  keyboard: { file: "generic/sfx/keyboard.mp3", volume: 0.06 },
  messageOut: { file: "generic/sfx/message-out.mp3", volume: 0.12 },
  messageIn: { file: "generic/sfx/message-in.mp3", volume: 0.12 },
} as const;

export const Sound = createNamedSfx(GENERIC_SOUNDS);

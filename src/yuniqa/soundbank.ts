import type { SoundBanks } from "../../scripts/sfx.mts";

// Prompts for `pnpm sfx --bank=src/yuniqa/soundbank.ts --set=<v2|v3>` (ElevenLabs Sound Effects).
// Aim for a quiet, modern app sound design: no cartoon, no game noises, and never a riser.
// Volumes live in brand.ts (SFX), far under the voice.
export const SOUND_BANKS: SoundBanks = {
  // v2: the general set — transitions, UI taps, messages, verdict stamps.
  v2: {
    dir: "yuniqa/audio/sfx-v2",
    sounds: [
      {
        name: "whoosh",
        prompt: "Soft airy cinematic whoosh transition, short, smooth, subtle, no impact, modern app promo",
        durationSeconds: 0.8,
        promptInfluence: 0.6,
      },
      {
        name: "pop",
        prompt: "Tiny soft UI bubble pop, gentle rounded click, very short, clean, minimal app interface sound",
        durationSeconds: 0.5,
        promptInfluence: 0.7,
      },
      {
        name: "click",
        prompt: "Subtle soft haptic tap, muted mechanical click, very short, minimal smartphone UI",
        durationSeconds: 0.5,
        promptInfluence: 0.7,
      },
      {
        name: "notification",
        prompt: "Soft two-note notification chime, warm marimba, gentle, short, modern phone app",
        durationSeconds: 1.2,
        promptInfluence: 0.6,
      },
      {
        name: "success",
        prompt:
          "Gentle ascending three-note success chime, soft glassy bells, warm, satisfying, short, app confirmation",
        durationSeconds: 1.4,
        promptInfluence: 0.6,
      },
      {
        name: "error",
        prompt: "Soft muted low error buzz, short, dull, subtle, app denied sound, not harsh",
        durationSeconds: 0.6,
        promptInfluence: 0.7,
      },
      {
        name: "magic-reveal",
        prompt:
          "Elegant soft shimmer logo reveal, gentle glassy sparkle with a warm low pad swell, premium brand sting, short",
        durationSeconds: 2.2,
        promptInfluence: 0.55,
      },
      {
        name: "keyboard",
        prompt: "Fast quiet smartphone keyboard typing taps, soft plastic, steady rhythm, close mic",
        durationSeconds: 4.0,
        promptInfluence: 0.6,
      },
      {
        name: "stamp",
        prompt: "Soft rubber stamp thud on paper, short, muted, satisfying, no reverb",
        durationSeconds: 0.7,
        promptInfluence: 0.7,
      },
      {
        name: "whip",
        prompt: "Fast cinematic whip transition, sharp air swipe, very short, punchy, modern edit sound",
        durationSeconds: 0.6,
        promptInfluence: 0.6,
      },
      {
        name: "impact",
        prompt:
          "Deep short cinematic impact hit, soft sub bass thump with a tight tail, trailer accent, no reverb tail",
        durationSeconds: 1.2,
        promptInfluence: 0.6,
      },
      {
        name: "message-out",
        prompt: "iMessage style sent message swoosh, light airy upward swipe, very short, clean UI sound",
        durationSeconds: 0.6,
        promptInfluence: 0.7,
      },
      {
        name: "message-in",
        prompt: "Soft incoming chat message pop, gentle rounded blip, very short, modern messaging app",
        durationSeconds: 0.5,
        promptInfluence: 0.7,
      },
      {
        name: "tick",
        prompt: "Single soft clock tick, muted wooden click, very short, quiet, no reverb",
        durationSeconds: 0.5,
        promptInfluence: 0.7,
      },
      {
        name: "swipe",
        prompt: "Very soft quick swipe, fabric-like air movement, short, subtle, smartphone gesture",
        durationSeconds: 0.5,
        promptInfluence: 0.6,
      },
    ],
  },
  // v3: a quieter, more expensive set — glass chimes and air instead of clicks and buzzes.
  v3: {
    dir: "yuniqa/audio/sfx-v3",
    sounds: [
      {
        name: "listen-on",
        prompt:
          "Soft ascending two note glass chime, gentle, premium voice assistant activation, short, clean, tiny reverb",
        durationSeconds: 1.0,
        promptInfluence: 0.55,
      },
      {
        name: "listen-off",
        prompt: "Soft descending two note glass chime, gentle voice assistant deactivation, short, clean",
        durationSeconds: 1.0,
        promptInfluence: 0.55,
      },
      {
        name: "card-in",
        prompt:
          "Soft airy paper swoosh ending in a tiny warm tick, a card sliding into place, premium interface, very short",
        durationSeconds: 0.7,
        promptInfluence: 0.6,
      },
      {
        name: "confirm",
        prompt:
          "Warm gentle three note glass confirmation chime, satisfying and understated, premium app success, short",
        durationSeconds: 1.3,
        promptInfluence: 0.55,
      },
      {
        name: "sweep",
        prompt:
          "Smooth elegant cinematic transition sweep, soft filtered air, no impact, no drums, refined scene change",
        durationSeconds: 1.0,
        promptInfluence: 0.5,
      },
      {
        name: "tap",
        prompt: "Very soft muted interface tick, tiny wooden tap, extremely short, subtle, close mic",
        durationSeconds: 0.5,
        promptInfluence: 0.7,
      },
      {
        name: "swell",
        prompt:
          "Elegant warm cinematic swell for a logo reveal, soft airy pad rising with a gentle glass shimmer, premium brand sting",
        durationSeconds: 2.4,
        promptInfluence: 0.5,
      },
      {
        name: "ping",
        prompt: "Single soft warm bell ping, gentle notification, short, minimal tail",
        durationSeconds: 0.8,
        promptInfluence: 0.65,
      },
    ],
  },
};

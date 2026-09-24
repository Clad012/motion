// Yuniqa brand constants. Colours come from the app's theme tokens (theme "yuniqa").
// The output format is shared by every project and re-exported here for convenience.
export { FPS, WIDTH, HEIGHT, SAFE } from "@/generic/engine/format";
export { VOICES } from "./voices";

export const COLORS = {
  bg: "#080808",
  surface: "#0f0f0f",
  surfaceRaised: "#1C1C1A",
  ink: "#F0EFEC",
  inkMuted: "rgba(240, 239, 236, 0.62)",
  inkFaint: "rgba(240, 239, 236, 0.14)",
  success: "#4ade80",
  warning: "#fbbf24",
  error: "#f87171",
  info: "#60a5fa",
} as const;

export const FONT_FAMILY = "Geist";
export const MONO_FAMILY = "Geist Mono";

export const ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
export const ELEVENLABS_FALLBACK_MODEL_ID = "eleven_multilingual_v2";

// Music beds from cdn.yuniqa.ai, fetched into public/yuniqa/audio/music by `pnpm assets`
// (the CDN sends no CORS headers, so the renderer cannot read it directly).
// Paths are relative to public/ — wrap with staticFile() at the call site.
export const MUSIC_FILE = "yuniqa/audio/music/beats3.mp3";
export const MUSIC_VOLUME = 0.07;

// Sound bank generated with ElevenLabs Sound Effects (`pnpm sfx`, specs in soundbank.ts).
// Volumes are relative to the voice at 1.0 and deliberately low so nothing competes with it.
export const SFX = {
  whoosh: { file: "yuniqa/audio/sfx-v2/whoosh.mp3", volume: 0.14 },
  swipe: { file: "yuniqa/audio/sfx-v2/swipe.mp3", volume: 0.12 },
  pop: { file: "yuniqa/audio/sfx-v2/pop.mp3", volume: 0.1 },
  click: { file: "yuniqa/audio/sfx-v2/click.mp3", volume: 0.1 },
  notification: { file: "yuniqa/audio/sfx-v2/notification.mp3", volume: 0.12 },
  success: { file: "yuniqa/audio/sfx-v2/success.mp3", volume: 0.13 },
  error: { file: "yuniqa/audio/sfx-v2/error.mp3", volume: 0.12 },
  stamp: { file: "yuniqa/audio/sfx-v2/stamp.mp3", volume: 0.16 },
  tick: { file: "yuniqa/audio/sfx-v2/tick.mp3", volume: 0.09 },
  whip: { file: "yuniqa/audio/sfx-v2/whip.mp3", volume: 0.16 },
  impact: { file: "yuniqa/audio/sfx-v2/impact.mp3", volume: 0.2 },
  messageOut: { file: "yuniqa/audio/sfx-v2/message-out.mp3", volume: 0.12 },
  messageIn: { file: "yuniqa/audio/sfx-v2/message-in.mp3", volume: 0.12 },
  // v3: quieter glass-and-air set, used by the voice video.
  listenOn: { file: "yuniqa/audio/sfx-v3/listen-on.mp3", volume: 0.14 },
  listenOff: { file: "yuniqa/audio/sfx-v3/listen-off.mp3", volume: 0.12 },
  cardIn: { file: "yuniqa/audio/sfx-v3/card-in.mp3", volume: 0.13 },
  confirm: { file: "yuniqa/audio/sfx-v3/confirm.mp3", volume: 0.13 },
  sweep: { file: "yuniqa/audio/sfx-v3/sweep.mp3", volume: 0.12 },
  tap: { file: "yuniqa/audio/sfx-v3/tap.mp3", volume: 0.1 },
  swell: { file: "yuniqa/audio/sfx-v3/swell.mp3", volume: 0.16 },
  ping: { file: "yuniqa/audio/sfx-v3/ping.mp3", volume: 0.12 },
  magicReveal: { file: "yuniqa/audio/sfx-v2/magic-reveal.mp3", volume: 0.16 },
  keyboard: { file: "yuniqa/audio/sfx-v2/keyboard.mp3", volume: 0.06 },
} as const;

export type SfxKey = keyof typeof SFX;

import { interpolate } from "remotion";
import type { VoiceoverWord } from "../../engine/voiceover";

/**
 * Voice envelope in 0..1 at a given frame, derived from the spoken words:
 * fast attack while a word plays, slow release after it.
 */
export const voiceLevel = (words: VoiceoverWord[], frame: number, fps: number): number => {
  const ms = (frame / fps) * 1000;
  let level = 0;
  for (const word of words) {
    if (ms < word.startMs - 60 || ms > word.endMs + 220) {
      continue;
    }
    const value =
      ms < word.startMs
        ? interpolate(ms, [word.startMs - 60, word.startMs], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : ms <= word.endMs
          ? 1
          : interpolate(ms, [word.endMs, word.endMs + 220], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
    level = Math.max(level, value);
  }
  return level;
};

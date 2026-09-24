import { FPS } from "./format";
import type { VoiceoverManifest, VoiceoverScene, VoiceoverWord } from "./voiceover";

export type TimelineScene = VoiceoverScene & {
  durationInFrames: number;
  from: number;
  /** Frames of silence before the voice line starts inside the scene. */
  voiceOffsetFrames: number;
};

export type TimelineOptions = {
  /** Silence added at the very start of the video, before the first voice line. */
  readonly leadInMs?: number;
};

export const msToFrames = (ms: number): number => Math.round((ms / 1000) * FPS);

/**
 * Turns a generated voiceover manifest into a scene timeline.
 * Each scene lasts exactly as long as its voice line plus its own hold (`tailMs`),
 * so editing the script and regenerating the audio re-times the video automatically.
 */
export const buildTimeline = (manifest: VoiceoverManifest, options: TimelineOptions = {}): TimelineScene[] => {
  let cursor = 0;
  return manifest.scenes.map((scene, index) => {
    const leadMs = index === 0 ? (options.leadInMs ?? 0) : 0;
    const voiceOffsetFrames = msToFrames(leadMs);
    // Word timings shift with the voice so captions and word-driven animations stay in sync.
    const words = leadMs
      ? scene.words.map((w) => ({ ...w, startMs: w.startMs + leadMs, endMs: w.endMs + leadMs }))
      : scene.words;
    const durationInFrames = Math.ceil(((scene.durationMs + scene.tailMs) / 1000) * FPS) + voiceOffsetFrames;
    const item: TimelineScene = { ...scene, words, durationInFrames, from: cursor, voiceOffsetFrames };
    cursor += durationInFrames;
    return item;
  });
};

/** A scene of a video without voiceover: fixed length, optional on-screen text. */
export type SilentScene = {
  readonly id: string;
  readonly durationMs: number;
  /** Shown as captions, word by word, as if it were spoken. */
  readonly text?: string;
};

/**
 * Timeline for a video with no voiceover. Words of `text` are spread across the
 * scene by length, so Captions and wordFrame() behave as they do on a voiced video.
 */
export const buildSilentTimeline = (scenes: SilentScene[]): TimelineScene[] => {
  let cursor = 0;
  return scenes.map((scene) => {
    const tokens = (scene.text ?? "").split(/\s+/).filter(Boolean);
    const spoken = scene.durationMs * 0.85;
    const letters = tokens.reduce((sum, t) => sum + t.length + 2, 0) || 1;
    let at = 0;
    const words: VoiceoverWord[] = tokens.map((text) => {
      const length = ((text.length + 2) / letters) * spoken;
      const word = { text, startMs: Math.round(at), endMs: Math.round(at + length * 0.9) };
      at += length;
      return word;
    });
    const durationInFrames = Math.ceil((scene.durationMs / 1000) * FPS);
    const item: TimelineScene = {
      id: scene.id,
      file: "",
      durationMs: scene.durationMs,
      tailMs: 0,
      modelId: "none",
      words,
      durationInFrames,
      from: cursor,
      voiceOffsetFrames: 0,
    };
    cursor += durationInFrames;
    return item;
  });
};

export const totalDuration = (timeline: TimelineScene[]): number =>
  timeline.reduce((sum, scene) => sum + scene.durationInFrames, 0);

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9']/g, "");

/**
 * Local frame at which a spoken word starts. `needle` is matched on the
 * accent/punctuation-stripped word; `occurrence` picks the n-th match (0-based).
 * Falls back to `fallbackFrame` so scenes never break if the script changes.
 */
export const wordFrame = (words: VoiceoverWord[], needle: string, fallbackFrame = 0, occurrence = 0): number => {
  const target = normalize(needle);
  let seen = 0;
  for (const word of words) {
    if (normalize(word.text).startsWith(target)) {
      if (seen === occurrence) {
        return msToFrames(word.startMs);
      }
      seen += 1;
    }
  }
  return fallbackFrame;
};

export const wordEndFrame = (words: VoiceoverWord[], needle: string, fallbackFrame = 0): number => {
  const target = normalize(needle);
  const word = words.find((w) => normalize(w.text).startsWith(target));
  return word ? msToFrames(word.endMs) : fallbackFrame;
};

export type SceneProps = {
  readonly words: VoiceoverWord[];
  readonly durationInFrames: number;
};

export type SceneMap = Record<string, React.FC<SceneProps>>;

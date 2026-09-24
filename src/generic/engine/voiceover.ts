export type VoiceoverWord = {
  text: string;
  startMs: number;
  endMs: number;
};

export type VoiceoverScene = {
  id: string;
  /** Path relative to public/, pass through staticFile(). */
  file: string;
  /** Spoken length in ms (from ElevenLabs alignment). */
  durationMs: number;
  /** Extra hold after the voice line, in ms. */
  tailMs: number;
  modelId: string;
  words: VoiceoverWord[];
};

export type VoiceoverManifest = {
  voiceId: string;
  generatedAt: string;
  scenes: VoiceoverScene[];
};

/**
 * One line of a video script. `voice` is what the narrator says; the scene lasts
 * as long as the generated audio plus `tailMs`. Scripts are read by Node
 * (scripts/voiceover.mts), so a script.ts file must not import anything React.
 */
export type ScriptLine = {
  readonly id: string;
  readonly voice: string;
  /** Hold after the line, in ms. */
  readonly tailMs?: number;
};

/** A manifest with no scenes: what a new video starts with before its voiceover exists. */
export const EMPTY_MANIFEST: VoiceoverManifest = { voiceId: "", generatedAt: "", scenes: [] };

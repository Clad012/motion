import type { VideoEntry } from "./registry";
import { SceneWithVoice } from "./SceneWithVoice";
import type { Theme } from "./theme";
import {
  buildSilentTimeline,
  buildTimeline,
  totalDuration,
  type SceneMap,
  type SilentScene,
  type TimelineScene,
} from "./timeline";
import type { ScriptLine, VoiceoverManifest } from "./voiceover";
import { VideoShell } from "./VideoShell";

type Common = {
  /** Composition id, unique across the whole project. PascalCase by convention. */
  readonly id: string;
  /** One line on the angle of the video. */
  readonly angle: string;
  readonly theme: Theme;
  /** One component per scene id of the script. */
  readonly scenes: SceneMap;
  /** Music bed. Omitted: the theme's music. null: no music. */
  readonly music?: { readonly file: string; readonly volume: number } | null;
};

const fromTimeline = ({ id, angle, theme, scenes, music }: Common, timeline: TimelineScene[]): VideoEntry => {
  const missing = timeline.filter((scene) => !scenes[scene.id]).map((scene) => scene.id);
  if (missing.length > 0) {
    throw new Error(`[${id}] no component for scene(s): ${missing.join(", ")}`);
  }
  const Component: React.FC = () => (
    <VideoShell
      timeline={timeline}
      scenes={scenes}
      musicFile={music === null ? null : music?.file}
      musicVolume={music?.volume}
    />
  );
  const SceneComponent: React.FC<{ readonly scene: TimelineScene }> = ({ scene }) => (
    <SceneWithVoice scene={scene} scenes={scenes} />
  );
  return { id, angle, theme, timeline, durationInFrames: totalDuration(timeline), Component, SceneComponent };
};

/**
 * A video driven by a generated voiceover (see scripts/voiceover.mts): scene
 * lengths come from the audio, so rewriting a line re-times the video.
 */
export const defineVoicedVideo = ({
  manifest,
  leadInMs,
  ...common
}: Common & {
  readonly manifest: VoiceoverManifest;
  /** Silence before the first voice line, e.g. 2000 to open on the picture. */
  readonly leadInMs?: number;
}): VideoEntry => fromTimeline(common, buildTimeline(manifest, { leadInMs }));

/** A video without voiceover: fixed scene lengths, captions from the scene text. */
export const defineSilentVideo = ({ script, ...common }: Common & { readonly script: SilentScene[] }): VideoEntry =>
  fromTimeline(common, buildSilentTimeline(script));

// Reading speed used to time a script before its voiceover exists (French and
// English narrators both land around 2.6 words per second).
const WORDS_PER_SECOND = 2.6;

const estimatedScript = (script: readonly ScriptLine[]): SilentScene[] =>
  script.map((line) => {
    const words = line.voice.split(/\s+/).filter(Boolean).length;
    return {
      id: line.id,
      text: line.voice,
      durationMs: Math.max(1500, Math.round((words / WORDS_PER_SECOND) * 1000) + (line.tailMs ?? 300)),
    };
  });

const manifestMatches = (manifest: VoiceoverManifest, script: readonly ScriptLine[]): boolean =>
  manifest.scenes.length === script.length && script.every((line, i) => manifest.scenes[i]?.id === line.id);

/**
 * A voice that no longer fits the script is an error, not a silent fallback:
 * renaming or adding a scene used to drop the whole voiceover without a word.
 */
const assertVoiceFitsScript = (id: string, manifest: VoiceoverManifest, script: readonly ScriptLine[]): void => {
  if (manifest.scenes.length === 0 || manifestMatches(manifest, script)) return;
  const voiced = new Set(manifest.scenes.map((scene) => scene.id));
  const unvoiced = script.filter((line) => !voiced.has(line.id)).map((line) => line.id);
  const fix =
    unvoiced.length > 0
      ? `pnpm voiceover --video=<folder> --only=${unvoiced.join(",")}`
      : "pnpm voiceover --video=<folder> (the scene order changed)";
  throw new Error(
    `[${id}] generated/voiceover.json does not match script.ts.\n` +
      `  script:    ${script.map((line) => line.id).join(", ")}\n` +
      `  voiceover: ${manifest.scenes.map((scene) => scene.id).join(", ")}\n` +
      `Regenerate the voice: ${fix}`,
  );
};

/**
 * The one to use for a new video. Renders straight away from the script, silent,
 * with captions timed from the text; once `pnpm voiceover --video=<id>` has written
 * a manifest that matches the script, the same scenes play with the real voice.
 * A manifest that exists but no longer matches the script throws.
 */
export const defineVideo = ({
  script,
  manifest,
  leadInMs,
  ...common
}: Common & {
  readonly script: readonly ScriptLine[];
  /** generated/voiceover.json; EMPTY_MANIFEST until the voiceover is generated. */
  readonly manifest: VoiceoverManifest;
  readonly leadInMs?: number;
}): VideoEntry => {
  assertVoiceFitsScript(common.id, manifest, script);
  return manifestMatches(manifest, script)
    ? fromTimeline(common, buildTimeline(manifest, { leadInMs }))
    : fromTimeline(common, buildSilentTimeline(estimatedScript(script)));
};

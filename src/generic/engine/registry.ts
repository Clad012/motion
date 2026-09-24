import type { Theme } from "./theme";
import type { TimelineScene } from "./timeline";

/**
 * One video, as Root.tsx registers it. `defineVoicedVideo` and `defineSilentVideo`
 * build these; a hand-made video can fill it in directly.
 */
export type VideoEntry = {
  /** Composition id: shown in the Studio and passed to `remotion render`. */
  readonly id: string;
  /** One line on the angle of the video, for humans reading the registry. */
  readonly angle: string;
  readonly theme: Theme;
  readonly Component: React.FC;
  readonly durationInFrames: number;
  /** Scenes, when the video is built from a timeline; each becomes its own Studio composition. */
  readonly timeline?: TimelineScene[];
  readonly SceneComponent?: React.FC<{ readonly scene: TimelineScene }>;
};

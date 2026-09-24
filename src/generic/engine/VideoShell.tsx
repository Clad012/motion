import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, interpolate, staticFile, useVideoConfig } from "remotion";
import { SceneWithVoice } from "./SceneWithVoice";
import { useTheme } from "./theme";
import { totalDuration, type SceneMap, type TimelineScene } from "./timeline";

type VideoShellProps = {
  readonly timeline: TimelineScene[];
  readonly scenes: SceneMap;
  /** Music bed relative to public/. Omitted: the theme's music. null: no music. */
  readonly musicFile?: string | null;
  readonly musicVolume?: number;
};

const DEFAULT_MUSIC_VOLUME = 0.07;

// Plays every scene back to back over a music bed that fades in and out.
export const VideoShell: React.FC<VideoShellProps> = ({ timeline, scenes, musicFile, musicVolume }) => {
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const total = totalDuration(timeline);
  const file = musicFile === undefined ? theme.music?.file : musicFile;
  const volume = musicVolume ?? theme.music?.volume ?? DEFAULT_MUSIC_VOLUME;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      {file ? (
        <Audio
          src={staticFile(file)}
          loop
          volume={(f) =>
            interpolate(f, [0, 1 * fps, total - 2 * fps, total], [0, volume, volume, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
      <Series>
        {timeline.map((scene) => (
          <Series.Sequence key={scene.id} name={scene.id} durationInFrames={scene.durationInFrames} premountFor={15}>
            <SceneWithVoice scene={scene} scenes={scenes} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

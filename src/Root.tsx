import "./index.css";
import { Composition, Folder } from "remotion";
import { FPS, HEIGHT, ThemeProvider, WIDTH, type TimelineScene, type VideoEntry } from "@/generic/engine";
import { GENERIC_VIDEOS } from "@/generic";
import { YUNIQA_VIDEOS } from "@/yuniqa";

// One folder per project in the Studio sidebar. Inside it, one composition per
// video, plus a "<id>-scenes" folder with each scene on its own so it can be
// worked on in isolation.
const PROJECTS: Array<{ readonly name: string; readonly videos: VideoEntry[] }> = [
  { name: "Yuniqa", videos: YUNIQA_VIDEOS },
  { name: "Generic", videos: GENERIC_VIDEOS },
];

type Registered = {
  readonly entry: VideoEntry;
  readonly Video: React.FC;
  readonly Scene: React.FC<{ readonly scene: TimelineScene }> | null;
};

// Components are created once, here, so every composition keeps a stable identity;
// each one renders inside its project's theme.
const register = (entry: VideoEntry): Registered => {
  const { Component, SceneComponent, theme } = entry;
  const Video: React.FC = () => (
    <ThemeProvider theme={theme}>
      <Component />
    </ThemeProvider>
  );
  const Scene: Registered["Scene"] = SceneComponent
    ? ({ scene }) => (
        <ThemeProvider theme={theme}>
          <SceneComponent scene={scene} />
        </ThemeProvider>
      )
    : null;
  return { entry, Video, Scene };
};

const REGISTERED = PROJECTS.map((project) => ({ name: project.name, videos: project.videos.map(register) }));

export const RemotionRoot: React.FC = () => (
  <>
    {REGISTERED.map((project) => (
      <Folder key={project.name} name={project.name}>
        {project.videos.map(({ entry, Video }) => (
          <Composition
            key={entry.id}
            id={entry.id}
            component={Video}
            durationInFrames={entry.durationInFrames}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        ))}
        {project.videos.map(({ entry, Scene }) =>
          Scene && entry.timeline && entry.timeline.length > 0 ? (
            <Folder key={`${entry.id}-scenes`} name={`${entry.id}-scenes`}>
              {entry.timeline.map((scene) => (
                <Composition
                  key={scene.id}
                  id={`${entry.id}-${scene.id}`}
                  component={Scene}
                  durationInFrames={scene.durationInFrames}
                  fps={FPS}
                  width={WIDTH}
                  height={HEIGHT}
                  defaultProps={{ scene }}
                />
              ))}
            </Folder>
          ) : null,
        )}
      </Folder>
    ))}
  </>
);

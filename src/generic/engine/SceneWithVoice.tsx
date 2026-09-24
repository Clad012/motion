import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import type { SceneMap, TimelineScene } from "./timeline";

type SceneWithVoiceProps = {
  readonly scene: TimelineScene;
  readonly scenes: SceneMap;
};

// Renders one scene together with its own voiceover track (none for silent timelines).
// Used inside the full video and by the per-scene compositions in the Studio.
export const SceneWithVoice: React.FC<SceneWithVoiceProps> = ({ scene, scenes }) => {
  const Scene = scenes[scene.id];
  if (!Scene) {
    throw new Error(`No component registered for scene "${scene.id}"`);
  }
  return (
    <AbsoluteFill>
      <Scene words={scene.words} durationInFrames={scene.durationInFrames} />
      {scene.file ? (
        <Sequence from={scene.voiceOffsetFrames} layout="none">
          <Audio src={staticFile(scene.file)} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Background, Captions, EndCard, PanelRow } from "../../components";
import { WIDTH, useTheme, wordFrame, type SceneProps } from "../../engine";
import { Sound } from "../../sounds";

// Hook: the three key words land one after another, on the word the voice says.
export const HookScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { colors, fonts } = useTheme();
  const beats = [
    { text: "Three scenes.", at: wordFrame(words, "three", 0) },
    { text: "One idea each.", at: wordFrame(words, "one", 20) },
    { text: "A whole video.", at: wordFrame(words, "whole", 45) },
  ];

  return (
    <AbsoluteFill>
      <Background />
      {beats.map((beat) => (
        <Sound key={beat.text} name="pop" from={beat.at} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 80,
          width: WIDTH - 160,
          top: 520,
          display: "flex",
          flexDirection: "column",
          gap: 30,
          fontFamily: fonts.sans,
          color: colors.ink,
        }}
      >
        {beats.map((beat) => (
          <div
            key={beat.text}
            style={{
              fontSize: 118,
              fontWeight: 900,
              letterSpacing: -5,
              lineHeight: 1,
              opacity: interpolate(frame, [beat.at, beat.at + 5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(frame, [beat.at, beat.at + 14], ["0px 60px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {beat.text}
          </div>
        ))}
      </div>
      <Captions words={words} />
    </AbsoluteFill>
  );
};

// Steps: a checklist whose rows arrive with the words that name them.
export const StepsScene: React.FC<SceneProps> = ({ words }) => {
  const rows = [
    { label: "Write the lines", detail: "script.ts", at: wordFrame(words, "write", 0) },
    { label: "Draw each scene", detail: "scenes.tsx", at: wordFrame(words, "draw", 25) },
    { label: "Let the voice time it", detail: "pnpm voiceover", at: wordFrame(words, "voice", 55) },
  ];
  return (
    <AbsoluteFill>
      <Background />
      <Sound name="sweep" from={0} />
      {rows.map((row) => (
        <Sound key={row.label} name="tap" from={row.at} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 110,
          width: WIDTH - 220,
          top: 560,
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        {rows.map((row) => (
          <PanelRow key={row.label} label={row.label} detail={row.detail} from={row.at} />
        ))}
      </div>
      <Captions words={words} />
    </AbsoluteFill>
  );
};

// End: the shared closing card.
export const EndScene: React.FC<SceneProps> = ({ words }) => (
  <AbsoluteFill>
    <Sound name="confirm" from={4} />
    <EndCard brand="Motion" lines={["Your turn."]} cta="copy this folder" from={2} ctaFrom={20} />
    <Captions words={words} tone="light" />
  </AbsoluteFill>
);

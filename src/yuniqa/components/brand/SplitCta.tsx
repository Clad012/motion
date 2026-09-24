import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "../../brand";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { LogoMark } from "./LogoMark";
import { Sfx } from "../Sfx";

type SplitCtaProps = SceneProps & {
  /** Headline, split over two lines. */
  readonly lines: [string, string];
  /** First spoken word of the scene, used to time the headline. */
  readonly firstWord: string;
};

// Shared closing card: light palette, wordmark, headline, link pill.
export const SplitCta: React.FC<SplitCtaProps> = ({ words, lines, firstWord }) => {
  const frame = useCurrentFrame();
  const start = wordFrame(words, firstWord, 0);
  const bio = wordFrame(words, "lien", 40) - 2;

  return (
    <AbsoluteFill>
      <Background tone="light" />
      <Sfx name="pop" from={start + 2} />
      <Sfx name="success" from={bio + 4} />

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          fontFamily: FONT_FAMILY,
          color: COLORS.surfaceRaised,
        }}
      >
        <LogoMark size={110} color={COLORS.surfaceRaised} progress={1} />
        <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -3 }}>yuniqa</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          width: WIDTH - 120,
          top: 660,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 120,
          fontWeight: 900,
          letterSpacing: -5,
          lineHeight: 1.08,
          color: COLORS.surfaceRaised,
          opacity: interpolate(frame, [start, start + 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [start, start + 14], [0.78, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.4, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        {lines[0]}
        <br />
        {lines[1]}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 1150,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [bio, bio + 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [bio, bio + 14], ["0px 50px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 62,
            fontWeight: 800,
            color: COLORS.ink,
            backgroundColor: COLORS.surfaceRaised,
            padding: "26px 60px",
            borderRadius: 999,
            boxShadow: "0 30px 70px rgba(28,28,26,0.25)",
            scale: interpolate(frame, [bio + 20, bio + 32, bio + 44], [1, 1.05, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.sin),
            }),
          }}
        >
          lien en bio ↓
        </div>
      </div>

      <Captions words={words} tone="light" />
    </AbsoluteFill>
  );
};

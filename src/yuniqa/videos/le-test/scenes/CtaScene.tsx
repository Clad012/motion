import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { LogoMark } from "@/yuniqa/components";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";

// CTA: hand the test back to the viewer.
export const CtaScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const test = wordFrame(words, "fais", 0);
  const bio = wordFrame(words, "lien", 38) - 2;

  return (
    <AbsoluteFill>
      <Background tone="light" />
      <Sfx name="pop" from={test + 2} />
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
          left: 0,
          width: WIDTH,
          top: 660,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 124,
          fontWeight: 900,
          letterSpacing: -5,
          lineHeight: 1.08,
          color: COLORS.surfaceRaised,
          opacity: interpolate(frame, [test, test + 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [test, test + 14], [0.78, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.4, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        Fais le test
        <br />
        toi-même.
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

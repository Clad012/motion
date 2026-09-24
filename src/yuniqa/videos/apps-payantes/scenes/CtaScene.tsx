import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { LogoMark } from "@/yuniqa/components";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";

// CTA: free test + link in bio, still on the light brand palette.
export const CtaScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const test = wordFrame(words, "teste", 2) - 2;
  const bio = wordFrame(words, "lien", 30) - 2;

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
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          fontFamily: FONT_FAMILY,
          color: COLORS.surfaceRaised,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LogoMark size={120} color={COLORS.surfaceRaised} progress={1} />
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -3 }}>yuniqa</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 640,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: FONT_FAMILY,
          color: COLORS.surfaceRaised,
          opacity: interpolate(frame, [test, test + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [test, test + 14], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.4, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <div style={{ fontSize: 132, fontWeight: 900, letterSpacing: -6, lineHeight: 1, textAlign: "center" }}>
          Teste-le
          <br />
          maintenant.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 1150,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [bio, bio + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
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
            fontSize: 64,
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

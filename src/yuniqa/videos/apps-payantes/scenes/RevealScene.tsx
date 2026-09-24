import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { LogoMark } from "@/yuniqa/components";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";

// Reveal: the palette flips to the light brand color, then the logo assembles.
export const RevealScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const oneApp = wordFrame(words, "une", 4);
  const oneSub = wordFrame(words, "abonnement", 22);
  const brand = wordFrame(words, "yuniqa", 45) - 4;

  const lineStyle = (start: number): React.CSSProperties => ({
    fontFamily: FONT_FAMILY,
    fontSize: 118,
    fontWeight: 900,
    letterSpacing: -5,
    lineHeight: 1,
    color: COLORS.surfaceRaised,
    opacity: interpolate(frame, [start, start + 5, brand, brand + 8], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    translate: interpolate(frame, [start, start + 14], ["0px 60px", "0px 0px"], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
  });

  return (
    <AbsoluteFill>
      <Background tone="light" />
      <Sfx name="whoosh" from={0} />
      <Sfx name="pop" from={oneApp} />
      <Sfx name="pop" from={oneSub} />
      <Sfx name="magicReveal" from={brand} />

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 640,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div style={lineStyle(oneApp)}>Une app.</div>
        <div style={lineStyle(oneSub)}>Un abonnement.</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 520,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(frame, [brand, brand + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <LogoMark
          size={460}
          color={COLORS.surfaceRaised}
          progress={interpolate(frame, [brand, brand + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 170,
            fontWeight: 700,
            letterSpacing: -8,
            color: COLORS.surfaceRaised,
            lineHeight: 1,
            opacity: interpolate(frame, [brand + 16, brand + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            scale: interpolate(frame, [brand + 16, brand + 34], [0.8, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1.3, 0.3, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          yuniqa
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 46,
            fontWeight: 500,
            color: "rgba(28,28,26,0.6)",
            letterSpacing: 2,
            opacity: interpolate(frame, [brand + 30, brand + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          Votre app IA tout-en-un
        </div>
      </div>

      <Captions words={words} tone="light" />
    </AbsoluteFill>
  );
};

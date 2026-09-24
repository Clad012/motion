import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { CAPTION_Y } from "../components/TestPanel";

// Verdict: two words, one struck through, one boxed.
export const VerdictScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const parle = wordFrame(words, "l'une", 0);
  const agit = wordFrame(words, "l'autre", 19) - 2;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="stamp" from={parle + 4} />
      <Sfx name="stamp" from={agit + 4} />

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
          fontFamily: FONT_FAMILY,
        }}
      >
        <div
          style={{
            position: "relative",
            fontSize: 150,
            fontWeight: 900,
            letterSpacing: -6,
            color: COLORS.inkMuted,
            opacity: interpolate(frame, [parle, parle + 5], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [parle, parle + 12], [1.4, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1.2, 0.3, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          l'une parle
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "52%",
              height: 10,
              borderRadius: 999,
              backgroundColor: COLORS.error,
              width: `${interpolate(frame, [parle + 6, parle + 18], [0, 100], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}%`,
            }}
          />
        </div>

        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            letterSpacing: -6,
            color: COLORS.surfaceRaised,
            backgroundColor: COLORS.ink,
            padding: "10px 44px",
            borderRadius: 30,
            opacity: interpolate(frame, [agit, agit + 5], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [agit, agit + 14], [1.5, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1.3, 0.3, 1),
              output: "perceptual-scale",
            }),
            rotate: "-2deg",
          }}
        >
          l'autre agit
        </div>
      </div>

      <Captions words={words} y={CAPTION_Y} />
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, HEIGHT, WIDTH } from "../../brand";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { Captions } from "@/generic/components/text";
import { LogoMark } from "./LogoMark";
import { Sfx } from "../Sfx";
import { BOTTOM_PANEL_Y, PANEL_HEIGHT, PANEL_LEFT, PANEL_WIDTH } from "@/generic/components/split";

type SplitRevealProps = SceneProps & {
  /** Line under the wordmark. */
  readonly tagline: string;
};

// Shared reveal for the split-screen videos: the winning panel grows until it
// owns the frame, then the mark assembles inside it.
export const SplitReveal: React.FC<SplitRevealProps> = ({ words, tagline }) => {
  const frame = useCurrentFrame();
  const brand = wordFrame(words, "yuniqa", 30) - 8;
  const expand = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Sfx name="whoosh" from={0} />
      <Sfx name="magicReveal" from={brand} />

      <div
        style={{
          position: "absolute",
          left: interpolate(expand, [0, 1], [PANEL_LEFT, 0]),
          top: interpolate(expand, [0, 1], [BOTTOM_PANEL_Y, 0]),
          width: interpolate(expand, [0, 1], [PANEL_WIDTH, WIDTH]),
          height: interpolate(expand, [0, 1], [PANEL_HEIGHT, HEIGHT]),
          borderRadius: interpolate(expand, [0, 1], [46, 0]),
          backgroundColor: COLORS.ink,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 620,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: interpolate(frame, [brand, brand + 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <LogoMark
          size={420}
          color={COLORS.surfaceRaised}
          progress={interpolate(frame, [brand, brand + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 160,
            fontWeight: 700,
            letterSpacing: -8,
            color: COLORS.surfaceRaised,
            lineHeight: 1,
            opacity: interpolate(frame, [brand + 14, brand + 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [brand + 14, brand + 32], [0.82, 1], {
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
            opacity: interpolate(frame, [brand + 26, brand + 36], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {tagline}
        </div>
      </div>

      <Captions words={words} tone="light" />
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../engine/theme";

type BackgroundProps = {
  readonly tone?: "dark" | "light";
};

// Brand-monochrome backdrop with two slow drifting halos so scenes never feel flat.
export const Background: React.FC<BackgroundProps> = ({ tone = "dark" }) => {
  const { colors } = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = tone === "dark";

  return (
    <AbsoluteFill style={{ backgroundColor: isDark ? colors.bg : colors.ink, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          left: -500,
          top: -300,
          background: isDark
            ? "radial-gradient(circle, rgba(240,239,236,0.07) 0%, rgba(240,239,236,0) 60%)"
            : "radial-gradient(circle, rgba(28,28,26,0.08) 0%, rgba(28,28,26,0) 60%)",
          translate: interpolate(frame, [0, 12 * fps], ["0px 0px", "160px 120px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.sin),
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          right: -500,
          bottom: -200,
          background: isDark
            ? "radial-gradient(circle, rgba(240,239,236,0.05) 0%, rgba(240,239,236,0) 60%)"
            : "radial-gradient(circle, rgba(28,28,26,0.06) 0%, rgba(28,28,26,0) 60%)",
          translate: interpolate(frame, [0, 12 * fps], ["0px 0px", "-140px -100px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.sin),
          }),
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
          opacity: isDark ? 1 : 0.35,
        }}
      />
    </AbsoluteFill>
  );
};

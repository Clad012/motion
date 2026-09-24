import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../engine/theme";
import { Glyph, type GlyphName } from "../icons/Glyph";

type ResultRowProps = {
  readonly label: string;
  readonly from: number;
  readonly width: number;
  readonly glyph?: GlyphName;
  readonly accent?: string;
  readonly strike?: boolean;
};

// Checklist-style row that pops in, used inside assistant cards.
export const ResultRow: React.FC<ResultRowProps> = ({
  label,
  from,
  width,
  glyph = "check",
  accent: accentProp,
  strike = false,
}) => {
  const { colors, fonts } = useTheme();
  const accent = accentProp ?? colors.success;
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: width * 0.025,
        fontFamily: fonts.sans,
        fontSize: width * 0.038,
        fontWeight: 500,
        color: colors.ink,
        opacity: interpolate(frame, [from, from + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [from, from + 12], ["-18px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div
        style={{
          width: width * 0.06,
          height: width * 0.06,
          borderRadius: "50%",
          backgroundColor: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          scale: interpolate(frame, [from + 4, from + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.4, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <Glyph name={glyph} size={width * 0.036} color="#0b0b0b" strokeWidth={3} />
      </div>
      <span style={{ textDecoration: strike ? "line-through" : undefined, opacity: strike ? 0.5 : 1 }}>{label}</span>
    </div>
  );
};

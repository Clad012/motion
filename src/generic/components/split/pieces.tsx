import type { ReactNode } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { WIDTH } from "../../engine/format";
import { useTheme } from "../../engine/theme";
import { Glyph, type GlyphName } from "../icons/Glyph";

/** Big number with a caption underneath, for the inside of a panel. */
export const BigStat: React.FC<{
  readonly value: ReactNode;
  readonly label: string;
  readonly from?: number;
  readonly color?: string;
}> = ({ value, label, from = 0, color: colorProp }) => {
  const { colors, fonts } = useTheme();
  const color = colorProp ?? colors.ink;
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.sans,
        opacity: interpolate(frame, [from, from + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: interpolate(frame, [from, from + 14], [0.75, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 1.4, 0.3, 1),
          output: "perceptual-scale",
        }),
      }}
    >
      <div style={{ fontSize: 132, fontWeight: 900, letterSpacing: -6, lineHeight: 1, color }}>{value}</div>
      <div style={{ fontSize: 36, fontWeight: 600, color: colors.inkMuted, marginTop: 12 }}>{label}</div>
    </div>
  );
};

/** A line inside a panel, with a small state icon on the left. */
export const PanelRow: React.FC<{
  readonly label: string;
  readonly detail?: string;
  readonly from: number;
  readonly glyph?: GlyphName;
  readonly accent?: string;
  readonly struck?: boolean;
}> = ({ label, detail, from, glyph = "check", accent: accentProp, struck = false }) => {
  const { colors, fonts } = useTheme();
  const accent = accentProp ?? colors.success;
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: fonts.sans,
        opacity: interpolate(frame, [from, from + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: interpolate(frame, [from, from + 13], ["-18px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          backgroundColor: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Glyph name={glyph} size={23} color="#0b0b0b" strokeWidth={3.2} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0 }}>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: colors.ink,
            textDecoration: struck ? "line-through" : undefined,
            opacity: struck ? 0.5 : 1,
          }}
        >
          {label}
        </div>
        {detail ? <div style={{ fontSize: 29, fontWeight: 500, color: colors.inkMuted }}>{detail}</div> : null}
      </div>
    </div>
  );
};

/** Centered badge sitting on the seam between the two panels. */
export const SeamBadge: React.FC<{
  readonly children: ReactNode;
  readonly from: number;
  readonly top: number;
  readonly background?: string;
}> = ({ children, from, top, background: backgroundProp }) => {
  const { colors, fonts } = useTheme();
  const background = backgroundProp ?? colors.warning;
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: WIDTH,
        top,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [from, from + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: interpolate(frame, [from, from + 14], [0.4, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 1.5, 0.3, 1),
          output: "perceptual-scale",
        }),
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 34,
          fontWeight: 900,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "#0b0b0b",
          backgroundColor: background,
          padding: "12px 30px",
          borderRadius: 999,
          border: "8px solid #080808",
        }}
      >
        {children}
      </div>
    </div>
  );
};

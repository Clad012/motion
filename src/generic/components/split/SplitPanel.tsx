import type { PropsWithChildren } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../engine/theme";
import { Glyph } from "../icons/Glyph";
import { PANEL_HEIGHT, PANEL_LEFT, PANEL_WIDTH } from "./layout";

export type PanelSide = "before" | "after";

export type SplitPanelProps = PropsWithChildren<{
  /** "before" is the muted side, "after" is the lit one. */
  readonly side: PanelSide;
  readonly label: string;
  readonly top: number;
  readonly from?: number;
  readonly badge?: string;
  readonly badgeAt?: number;
  readonly dimmed?: boolean;
}>;

// One half of the comparison. Both halves share the same chrome so the eye only
// compares the content.
export const SplitPanel: React.FC<SplitPanelProps> = ({
  side,
  label,
  top,
  from = 0,
  badge,
  badgeAt,
  dimmed = false,
  children,
}) => {
  const { colors, fonts } = useTheme();
  const frame = useCurrentFrame();
  const isAfter = side === "after";

  return (
    <div
      style={{
        position: "absolute",
        left: PANEL_LEFT,
        width: PANEL_WIDTH,
        height: PANEL_HEIGHT,
        top,
        borderRadius: 46,
        backgroundColor: isAfter ? colors.surfaceRaised : "rgba(240,239,236,0.04)",
        border: isAfter ? "2px solid rgba(240,239,236,0.22)" : "2px dashed rgba(240,239,236,0.16)",
        boxShadow: isAfter ? "0 34px 90px rgba(0,0,0,0.6)" : undefined,
        padding: "26px 34px",
        display: "flex",
        flexDirection: "column",
        fontFamily: fonts.sans,
        color: colors.ink,
        opacity: interpolate(frame, [from, from + 8], [0, dimmed ? 0.42 : 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [from, from + 16], [isAfter ? "0px 44px" : "0px -44px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: isAfter ? colors.ink : colors.inkMuted,
          }}
        >
          {label}
        </div>
        {badge && badgeAt !== undefined ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 27,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
              padding: "8px 18px",
              borderRadius: 999,
              backgroundColor: isAfter ? colors.success : colors.error,
              color: "#0b0b0b",
              opacity: interpolate(frame, [badgeAt, badgeAt + 5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              scale: interpolate(frame, [badgeAt, badgeAt + 12], [0.4, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.2, 1.4, 0.3, 1),
                output: "perceptual-scale",
              }),
            }}
          >
            <Glyph name={isAfter ? "check" : "cross"} size={23} color="#0b0b0b" strokeWidth={3.4} />
            {badge}
          </div>
        ) : null}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
};

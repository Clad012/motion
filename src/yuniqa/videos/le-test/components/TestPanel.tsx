import type { PropsWithChildren } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Glyph } from "@/generic/components/icons";

export const PANEL_LEFT = 90;
export const PANEL_WIDTH = WIDTH - 180;
export const PANEL_HEIGHT = 470;
export const TOP_PANEL_Y = 330;
export const BOTTOM_PANEL_Y = 830;
export const CAPTION_Y = 1420;

type Variant = "classique" | "agent";

type TestPanelProps = PropsWithChildren<{
  readonly variant: Variant;
  readonly label: string;
  readonly top: number;
  readonly from: number;
  /** Frame at which the verdict badge appears; omit for none. */
  readonly badgeAt?: number;
  readonly badge?: string;
  readonly dimmed?: boolean;
}>;

// One side of the comparison. "classique" is muted and dashed, "agent" is solid and lit.
export const TestPanel: React.FC<TestPanelProps> = ({
  variant,
  label,
  top,
  from,
  badgeAt,
  badge,
  dimmed = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const isAgent = variant === "agent";

  return (
    <div
      style={{
        position: "absolute",
        left: PANEL_LEFT,
        width: PANEL_WIDTH,
        height: PANEL_HEIGHT,
        top,
        borderRadius: 44,
        backgroundColor: isAgent ? COLORS.surfaceRaised : "rgba(240,239,236,0.04)",
        border: isAgent ? "2px solid rgba(240,239,236,0.22)" : "2px dashed rgba(240,239,236,0.16)",
        boxShadow: isAgent ? "0 30px 80px rgba(0,0,0,0.55)" : undefined,
        padding: "28px 36px",
        fontFamily: FONT_FAMILY,
        color: COLORS.ink,
        opacity: interpolate(frame, [from, from + 8], [0, dimmed ? 0.45 : 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [from, from + 16], [isAgent ? "0px 50px" : "0px -50px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: isAgent ? COLORS.ink : COLORS.inkMuted,
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
              fontSize: 28,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
              padding: "8px 18px",
              borderRadius: 999,
              backgroundColor: isAgent ? COLORS.success : COLORS.error,
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
            <Glyph name={isAgent ? "check" : "cross"} size={24} color="#0b0b0b" strokeWidth={3.4} />
            {badge}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
};

// Three pulsing dots, used while a side is "thinking".
export const ThinkingDots: React.FC<{ readonly from: number; readonly color?: string }> = ({
  from,
  color = COLORS.inkMuted,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center", height: 60 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: interpolate((frame - from - i * 6) % 36, [0, 12, 24, 36], [0.25, 1, 0.25, 0.25], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      ))}
    </div>
  );
};

// The prompt both assistants receive.
export const PromptPill: React.FC<{ readonly children: React.ReactNode; readonly from: number }> = ({
  children,
  from,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: PANEL_LEFT,
        width: PANEL_WIDTH,
        top: 180,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.ink,
          color: COLORS.surfaceRaised,
          fontFamily: FONT_FAMILY,
          fontSize: 42,
          fontWeight: 700,
          padding: "22px 40px",
          borderRadius: 999,
          textAlign: "center",
          opacity: interpolate(frame, [from, from + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [from, from + 14], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.3, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        {children}
      </div>
    </div>
  );
};

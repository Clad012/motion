import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { WIDTH } from "../../engine/format";
import { useTheme } from "../../engine/theme";

type EndCardProps = {
  /** Brand name or wordmark shown at the top. */
  readonly brand: ReactNode;
  /** Headline, one entry per line. */
  readonly lines: readonly string[];
  /** Pill under the headline, e.g. "link in bio ↓". */
  readonly cta?: string;
  /** Local frame at which the headline lands. */
  readonly from?: number;
  /** Local frame at which the pill lands. */
  readonly ctaFrom?: number;
};

// Closing card on the inverted palette (ink background): brand, headline, call to action.
export const EndCard: React.FC<EndCardProps> = ({ brand, lines, cta, from = 0, ctaFrom = from + 14 }) => {
  const frame = useCurrentFrame();
  const { colors, fonts } = useTheme();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, fontFamily: fonts.sans, color: colors.surfaceRaised }}>
      <div style={{ position: "absolute", top: 300, width: WIDTH, display: "flex", justifyContent: "center" }}>
        <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -3 }}>{brand}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          width: WIDTH - 120,
          top: 660,
          textAlign: "center",
          fontSize: 120,
          fontWeight: 900,
          letterSpacing: -5,
          lineHeight: 1.08,
          opacity: interpolate(frame, [from, from + 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [from, from + 14], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.4, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      {cta ? (
        <div
          style={{
            position: "absolute",
            top: 1150,
            width: WIDTH,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [ctaFrom, ctaFrom + 5], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [ctaFrom, ctaFrom + 14], ["0px 50px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              color: colors.ink,
              backgroundColor: colors.surfaceRaised,
              padding: "26px 60px",
              borderRadius: 999,
            }}
          >
            {cta}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

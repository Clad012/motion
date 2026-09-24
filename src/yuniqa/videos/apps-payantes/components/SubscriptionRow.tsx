import {
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { COLORS, FONT_FAMILY } from "@/yuniqa/brand";

type SubscriptionRowProps = {
  readonly name: string;
  /** File name (without extension) in public/yuniqa/logos. */
  readonly logo: string;
  readonly price: number;
  readonly note: string;
  readonly flag?: "warning" | "cancel";
  readonly from: number;
  readonly warnAt: number;
  readonly cancelAt: number;
  readonly width: number;
};

const formatPrice = (value: number): string =>
  `${value.toFixed(2).replace(".", ",")} €`;

// One subscription line: slides in, then gets a warning badge or a strike-through "à annuler".
export const SubscriptionRow: React.FC<SubscriptionRowProps> = ({
  name,
  logo,
  price,
  note,
  flag,
  from,
  warnAt,
  cancelAt,
  width,
}) => {
  const frame = useCurrentFrame();
  const isWarning = flag === "warning" && frame >= warnAt;
  const isCancelled = flag === "cancel" && frame >= cancelAt;
  const badgeStart = flag === "warning" ? warnAt : cancelAt;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1.5px solid rgba(240,239,236,0.08)",
        fontFamily: FONT_FAMILY,
        color: COLORS.ink,
        opacity: interpolate(frame, [from, from + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(
          frame,
          [from, from + 12],
          ["40px 0px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: width * 0.085,
            height: width * 0.085,
            borderRadius: width * 0.022,
            backgroundColor: COLORS.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            opacity: isCancelled ? 0.45 : 1,
          }}
        >
          <Img
            src={staticFile(`yuniqa/logos/${logo}.svg`)}
            style={{ width: width * 0.05, height: width * 0.05 }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              fontSize: width * 0.044,
              fontWeight: 600,
              lineHeight: 1.15,
              textDecoration: isCancelled ? "line-through" : undefined,
              opacity: isCancelled ? 0.45 : 1,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: width * 0.03,
              color: isWarning ? COLORS.warning : COLORS.inkMuted,
              fontWeight: isWarning ? 600 : 500,
            }}
          >
            {note}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {flag ? (
          <div
            style={{
              fontSize: width * 0.03,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 999,
              backgroundColor:
                flag === "warning" ? COLORS.warning : COLORS.success,
              color: "#0b0b0b",
              textTransform: "uppercase",
              letterSpacing: 1,
              opacity: interpolate(
                frame,
                [badgeStart, badgeStart + 5],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
              scale: interpolate(
                frame,
                [badgeStart, badgeStart + 12],
                [0.4, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.2, 1.4, 0.3, 1),
                  output: "perceptual-scale",
                },
              ),
            }}
          >
            {flag === "warning" ? "demain" : "à annuler"}
          </div>
        ) : null}
        <div
          style={{
            fontSize: width * 0.044,
            fontWeight: 700,
            opacity: isCancelled ? 0.45 : 1,
            textDecoration: isCancelled ? "line-through" : undefined,
          }}
        >
          {formatPrice(price)}
        </div>
      </div>
    </div>
  );
};

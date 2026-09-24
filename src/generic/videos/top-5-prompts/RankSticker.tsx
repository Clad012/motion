import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "@/generic/engine";

type RankStickerProps = {
  readonly label: string;
  /** Local frame at which the sticker slams in. */
  readonly from: number;
  readonly left: number;
  readonly top: number;
  readonly size?: number;
  readonly rotate?: number;
};

// A sticker slapped onto the phone: overshoots, settles, then keeps breathing.
export const RankSticker: React.FC<RankStickerProps> = ({ label, from, left, top, size = 150, rotate = -8 }) => {
  const frame = useCurrentFrame();
  const { colors, fonts } = useTheme();
  const t = frame - from;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        padding: `${size * 0.14}px ${size * 0.34}px`,
        borderRadius: size,
        backgroundColor: colors.warning,
        color: "#111",
        fontFamily: fonts.sans,
        fontSize: size * 0.62,
        fontWeight: 900,
        letterSpacing: -2,
        lineHeight: 1,
        boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        opacity: interpolate(t, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: interpolate(t, [0, 12], [2.4, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 1.5, 0.3, 1),
          output: "perceptual-scale",
        }),
        rotate: `${rotate + Math.sin(Math.max(0, t) / 14) * 2}deg`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

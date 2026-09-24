import { Easing, interpolate } from "remotion";

type LogoMarkProps = {
  readonly size: number;
  readonly color: string;
  /** 0..1, circles pop in one after another. */
  readonly progress: number;
};

// Geometry from apps/mobile/assets/icons/yuniqa-mark-*.svg (268x268 viewBox).
const CIRCLES = [
  { cx: 97.507, cy: 98.201, r: 19.201 },
  { cx: 160.772, cy: 101.466, r: 37.466 },
  { cx: 106.466, cy: 162.127, r: 37.466 },
  { cx: 169.507, cy: 165.201, r: 19.201 },
];

export const LogoMark: React.FC<LogoMarkProps> = ({ size, color, progress }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 268 268" fill="none">
      {CIRCLES.map((c, i) => {
        const local = interpolate(progress, [i * 0.16, i * 0.16 + 0.52], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 1.4, 0.3, 1),
        });
        return <circle key={i} cx={c.cx} cy={c.cy} r={c.r * local} fill={color} />;
      })}
    </svg>
  );
};

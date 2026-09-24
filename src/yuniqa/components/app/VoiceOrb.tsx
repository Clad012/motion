import { COLORS } from "../../brand";

// Geometry of the Yuniqa mark, ordered clockwise so a syllable travels the ring.
const DOTS = [
  { cx: 97.507, cy: 98.201, r: 19.201, order: 0 },
  { cx: 160.772, cy: 101.466, r: 37.466, order: 1 },
  { cx: 169.507, cy: 165.201, r: 19.201, order: 2 },
  { cx: 106.466, cy: 162.127, r: 37.466, order: 3 },
];

// Same idea as the app's live orb: each dot hears the level a little later than
// the previous one, so speech reads as a ripple instead of four dots pulsing together.
const DELAY_FRAMES = [0, 1.7, 3.3, 5];
const GAINS = [1, 0.86, 0.95, 0.92];

type VoiceOrbProps = {
  readonly size: number;
  readonly color?: string;
  /** 0..1 voice level. */
  readonly level: number;
  /** Slow breathing when there is nothing to react to. */
  readonly frame: number;
  readonly idle?: boolean;
};

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ size, color = COLORS.ink, level, frame, idle = false }) => (
  <svg width={size} height={size} viewBox="0 0 268 268" fill="none">
    {DOTS.map((dot) => {
      const breath = 1 + 0.05 * Math.sin((frame / 30) * 1.4 + dot.order * 0.9);
      const delayed = Math.max(0, level - DELAY_FRAMES[dot.order] * 0.012);
      // The dots stay separate: they grow a little and drift outwards, rather than
      // inflating into each other and reading as one blob.
      const scale = idle ? breath : 1 + delayed * 0.1 * GAINS[dot.order];
      const push = idle ? 0 : delayed * 11 * GAINS[dot.order];
      const dx = dot.cx - 133.5;
      const dy = dot.cy - 133.5;
      const length = Math.hypot(dx, dy) || 1;
      return (
        <circle
          key={dot.order}
          cx={dot.cx + (dx / length) * push}
          cy={dot.cy + (dy / length) * push}
          r={dot.r * scale}
          fill={color}
        />
      );
    })}
  </svg>
);

import type { PropsWithChildren } from "react";
import { useTheme } from "../../engine/theme";

type IPhoneProps = PropsWithChildren<{
  /** Screen width in px; every other dimension derives from it. */
  readonly width: number;
  readonly time?: string;
  /** Slight 3D tilt, in degrees. Positive turns the right edge away. */
  readonly tiltY?: number;
  readonly glare?: boolean;
}>;

// iPhone-like hardware: titanium rim, black bezel, Dynamic Island, status bar,
// home indicator and a glass glare. Proportions follow a 6.1" device (19.5:9).
export const IPHONE_RATIO = 2.164;
/** Screen height for a 430px-wide device; multiply by the screen scale. */
export const SCREEN_HEIGHT_BASE = 430 * IPHONE_RATIO - 2 * (11 + 9) - 58;

const StatusIcons: React.FC<{ readonly scale: number; readonly color: string }> = ({ scale, color }) => (
  <svg width={78 * scale} height={16 * scale} viewBox="0 0 78 16" fill="none">
    {/* signal */}
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={i * 5.5} y={10 - i * 3} width="4" height={5 + i * 3} rx="1.2" fill={color} />
    ))}
    {/* wifi */}
    <path
      d="M31 6.4a9.5 9.5 0 0111 0M33.2 9.4a6 6 0 016.6 0M35.6 12.2a2.6 2.6 0 011.8-.7c.7 0 1.3.25 1.8.7l-1.8 2z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    {/* battery */}
    <rect x="54" y="3.5" width="20" height="10" rx="3" stroke={color} strokeOpacity="0.5" strokeWidth="1.3" />
    <rect x="55.6" y="5.1" width="14" height="6.8" rx="1.8" fill={color} />
    <path d="M75.6 7.2v3.2c1-.3 1.6-.9 1.6-1.6s-.6-1.3-1.6-1.6z" fill={color} fillOpacity="0.5" />
  </svg>
);

export const IPhone: React.FC<IPhoneProps> = ({ width, time = "9:41", tiltY = 0, glare = true, children }) => {
  const { colors } = useTheme();
  const height = width * IPHONE_RATIO;
  const scale = width / 430;
  const rim = 11 * scale;
  const bezel = 9 * scale;
  const outerRadius = 68 * scale;
  const screenRadius = outerRadius - rim - bezel;

  return (
    <div
      style={{
        width,
        height,
        perspective: 2000,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: outerRadius,
          rotate: `y ${tiltY}deg`,
          // Titanium rim
          background: "linear-gradient(145deg, #6f6f6d 0%, #2a2a29 18%, #8d8d8a 50%, #2a2a29 82%, #6f6f6d 100%)",
          padding: rim,
          boxShadow: "0 60px 130px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)",
          position: "relative",
        }}
      >
        {/* Side buttons */}
        <div
          style={{
            position: "absolute",
            left: -3 * scale,
            top: height * 0.19,
            width: 4 * scale,
            height: 34 * scale,
            borderRadius: 3 * scale,
            background: "linear-gradient(180deg, #575754, #2c2c2b)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -3 * scale,
            top: height * 0.27,
            width: 4 * scale,
            height: 62 * scale,
            borderRadius: 3 * scale,
            background: "linear-gradient(180deg, #575754, #2c2c2b)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -3 * scale,
            top: height * 0.24,
            width: 4 * scale,
            height: 80 * scale,
            borderRadius: 3 * scale,
            background: "linear-gradient(180deg, #575754, #2c2c2b)",
          }}
        />

        {/* Black bezel */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: outerRadius - rim,
            backgroundColor: "#000",
            padding: bezel,
          }}
        >
          {/* Screen */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: screenRadius,
              backgroundColor: colors.surface,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Status bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 58 * scale,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `0 ${30 * scale}px`,
                zIndex: 3,
                color: colors.ink,
                fontSize: 20 * scale,
                fontWeight: 700,
              }}
            >
              <div style={{ letterSpacing: 0.2 }}>{time}</div>
              <StatusIcons scale={scale} color={colors.ink} />
            </div>

            {/* Dynamic Island */}
            <div
              style={{
                position: "absolute",
                top: 13 * scale,
                left: "50%",
                translate: "-50% 0",
                width: 118 * scale,
                height: 34 * scale,
                borderRadius: 999,
                backgroundColor: "#000",
                zIndex: 4,
              }}
            />

            {/* App content */}
            <div style={{ position: "absolute", inset: 0, paddingTop: 58 * scale, zIndex: 1 }}>{children}</div>

            {/* Home indicator */}
            <div
              style={{
                position: "absolute",
                bottom: 9 * scale,
                left: "50%",
                translate: "-50% 0",
                width: 138 * scale,
                height: 5 * scale,
                borderRadius: 999,
                backgroundColor: "rgba(240,239,236,0.55)",
                zIndex: 4,
              }}
            />

            {/* Glass glare */}
            {glare ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 5,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 22%, rgba(255,255,255,0) 42%)",
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

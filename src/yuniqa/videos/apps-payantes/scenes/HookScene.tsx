import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { AppTile } from "@/generic/components/ui";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";

const APPS = [
  { label: "Tâches", glyph: "tasks", price: 4.99 },
  { label: "Notes", glyph: "notes", price: 9.99 },
  { label: "Budget", glyph: "budget", price: 6.99 },
  { label: "Repas", glyph: "meals", price: 8.99 },
  { label: "Mails", glyph: "mail", price: 5.99 },
  { label: "IA", glyph: "ai", price: 12.99 },
] as const;

const TILE = 250;
const GAP = 34;
const COLUMNS = 3;
const GRID_TOP = 640;
const formatEuro = (value: number): string => `${value.toFixed(2).replace(".", ",")} €`;

// Hook: "regarde ton téléphone" — a home-screen grid, price badges pop one by one,
// the monthly total counts up, then the apps fade because they are never opened.
export const HookScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badgesStart = wordFrame(words, "six", 20) - 2;
  const totalStart = wordFrame(words, "cinquante", 45) - 4;
  const neverStart = wordFrame(words, "jamais", 95) - 2;
  const badgeGap = 4;
  const total = APPS.reduce((sum, a) => sum + a.price, 0);
  const shownTotal = interpolate(frame, [totalStart, totalStart + 0.8 * fps], [0, total], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const gridWidth = COLUMNS * TILE + (COLUMNS - 1) * GAP;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="swipe" from={0} />
      {APPS.map((_, i) => (
        <Sfx key={i} name="click" from={badgesStart + i * badgeGap} />
      ))}
      <Sfx name="whoosh" from={totalStart} />
      <Sfx name="error" from={neverStart} />

      {/* Monthly total */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 250,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          color: COLORS.ink,
          opacity: interpolate(frame, [totalStart, totalStart + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [totalStart, totalStart + 12], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.4, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <div style={{ fontSize: 190, fontWeight: 900, letterSpacing: -9, lineHeight: 1 }}>{formatEuro(shownTotal)}</div>
        <div style={{ fontSize: 56, fontWeight: 600, color: COLORS.inkMuted, marginTop: 6 }}>par mois</div>
      </div>

      {/* Home-screen grid */}
      <div
        style={{
          position: "absolute",
          left: (WIDTH - gridWidth) / 2,
          top: GRID_TOP,
          display: "grid",
          gridTemplateColumns: `repeat(${COLUMNS}, ${TILE}px)`,
          gap: GAP,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [0, 18], ["0px 90px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {APPS.map((app, i) => {
          const badgeAt = badgesStart + i * badgeGap;
          return (
            <div
              key={app.label}
              style={{
                position: "relative",
                opacity: interpolate(frame, [neverStart, neverStart + 10], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                filter: frame >= neverStart ? "grayscale(1)" : undefined,
              }}
            >
              <AppTile label={app.label} glyph={app.glyph} size={TILE} />
              <div
                style={{
                  position: "absolute",
                  top: -18,
                  right: -18,
                  backgroundColor: COLORS.error,
                  color: "#160606",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 34,
                  padding: "8px 20px",
                  borderRadius: 999,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.4)",
                  opacity: interpolate(frame, [badgeAt, badgeAt + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  scale: interpolate(frame, [badgeAt, badgeAt + 10], [0.3, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.2, 1.5, 0.3, 1),
                    output: "perceptual-scale",
                  }),
                }}
              >
                {formatEuro(app.price)}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -46,
                  textAlign: "center",
                  fontFamily: FONT_FAMILY,
                  fontSize: 28,
                  fontWeight: 600,
                  color: COLORS.error,
                  opacity: interpolate(frame, [neverStart + 4, neverStart + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                0 ouverture
              </div>
            </div>
          );
        })}
      </div>

      <Captions words={words} />
    </AbsoluteFill>
  );
};

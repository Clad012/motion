import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, HEIGHT, WIDTH } from "@/yuniqa/brand";
import { AppTile } from "@/generic/components/ui";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Glyph, type GlyphName } from "@/generic/components/icons";
import { PhoneFrame } from "@/generic/components/device";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";

const FLYING = [
  { label: "Tâches", glyph: "tasks", fromX: -400, fromY: 200 },
  { label: "Notes", glyph: "notes", fromX: 1200, fromY: 260 },
  { label: "Budget", glyph: "budget", fromX: -420, fromY: 1400 },
  { label: "Repas", glyph: "meals", fromX: 1250, fromY: 1350 },
  { label: "Mails", glyph: "mail", fromX: 500, fromY: -450 },
  { label: "IA", glyph: "ai", fromX: 520, fromY: 2100 },
] as const;

const POWERS: Array<{ label: string; glyph: GlyphName; needle: string }> = [
  { label: "se souvient", glyph: "notes", needle: "souvient" },
  { label: "surveille", glyph: "bell", needle: "surveille" },
  { label: "agit à ta place", glyph: "check", needle: "agit" },
];

const PHONE_WIDTH = 520;

// Turn: every app flies into one phone, then the three verbs land on its screen.
export const TurnScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const mergeStart = wordFrame(words, "seule", 30) - 14;
  const phoneCenterX = WIDTH / 2;
  const phoneCenterY = 260 + (PHONE_WIDTH * 2.05) / 2;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="whoosh" from={mergeStart} />
      <Sfx name="success" from={mergeStart + 20} />

      <div
        style={{
          position: "absolute",
          left: (WIDTH - PHONE_WIDTH) / 2,
          top: 260,
          opacity: interpolate(frame, [mergeStart + 8, mergeStart + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [mergeStart + 8, mergeStart + 26], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.3, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <PhoneFrame width={PHONE_WIDTH} title="Une seule app">
          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 120 }}>
            {POWERS.map((p, i) => {
              const start = wordFrame(words, p.needle, mergeStart + 40 + i * 20) - 2;
              return (
                <div
                  key={p.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                    padding: "26px 28px",
                    borderRadius: 30,
                    backgroundColor: COLORS.surfaceRaised,
                    border: "1.5px solid rgba(240,239,236,0.10)",
                    fontFamily: FONT_FAMILY,
                    fontSize: 40,
                    fontWeight: 600,
                    color: COLORS.ink,
                    opacity: interpolate(frame, [start, start + 6], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    translate: interpolate(frame, [start, start + 14], ["60px 0px", "0px 0px"], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    }),
                  }}
                >
                  <Sfx name="pop" from={start + 1} />
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 20,
                      backgroundColor: COLORS.ink,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Glyph name={p.glyph} size={34} color={COLORS.surfaceRaised} strokeWidth={2.6} />
                  </div>
                  {p.label}
                </div>
              );
            })}
          </div>
        </PhoneFrame>
      </div>

      {FLYING.map((tile, i) => {
        const start = i * 2;
        const end = mergeStart + 10 + i * 2;
        return (
          <div
            key={tile.label}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              translate: interpolate(
                frame,
                [start, mergeStart, end],
                [
                  `${tile.fromX}px ${tile.fromY}px`,
                  `${tile.fromX + (phoneCenterX - tile.fromX) * 0.35 - 100}px ${tile.fromY + (phoneCenterY - tile.fromY) * 0.35 - 100}px`,
                  `${phoneCenterX - 100}px ${phoneCenterY - 100}px`,
                ],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: [Easing.out(Easing.quad), Easing.in(Easing.cubic)],
                },
              ),
              scale: interpolate(frame, [mergeStart, end], [1, 0.05], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.in(Easing.cubic),
              }),
              opacity: interpolate(frame, [start, start + 6, end - 2, end], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              rotate: `${(i % 2 === 0 ? -1 : 1) * 10}deg`,
            }}
          >
            <AppTile label={tile.label} glyph={tile.glyph} size={200} />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: HEIGHT * 0.09,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 64,
          fontWeight: 700,
          color: COLORS.inkMuted,
          opacity: interpolate(frame, [0, 10, mergeStart - 6, mergeStart], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        et si…
      </div>

      <Captions words={words} />
    </AbsoluteFill>
  );
};

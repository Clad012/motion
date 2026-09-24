import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { AppTile } from "@/generic/components/ui";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Glyph } from "@/generic/components/icons";
import { Sfx } from "@/yuniqa/components";
import { TypeText } from "@/generic/components/text";
import { wordFrame, type SceneProps } from "@/generic/engine";

const STACK = [
  { label: "Tâches", glyph: "tasks", needle: "taches" },
  { label: "Notes", glyph: "notes", needle: "notes" },
  { label: "Budget", glyph: "budget", needle: "budget" },
  { label: "Repas", glyph: "meals", needle: "repas" },
] as const;

// Pile: one app per need stacks up, then the "AI that answers but does nothing" gag.
export const PileScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const aiStart = wordFrame(words, "ia", 95) - 2;
  const nothingStart = wordFrame(words, "rien", 150) - 2;
  const tileSize = 200;
  const gap = 26;
  const stackWidth = STACK.length * tileSize + (STACK.length - 1) * gap;

  return (
    <AbsoluteFill>
      <Background />
      {STACK.map((item, i) => {
        const start = wordFrame(words, item.needle, 20 + i * 25) - 3;
        return (
          <div
            key={item.label}
            style={{
              position: "absolute",
              left: (WIDTH - stackWidth) / 2 + i * (tileSize + gap),
              top: 360,
              opacity: interpolate(frame, [start, start + 5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              scale: interpolate(frame, [start, start + 14], [0.4, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.2, 1.5, 0.3, 1),
                output: "perceptual-scale",
              }),
            }}
          >
            <AppTile label={item.label} glyph={item.glyph} size={tileSize} />
            <Sfx name="pop" from={start + 2} />
          </div>
        );
      })}

      {/* The AI card */}
      <div
        style={{
          position: "absolute",
          left: 120,
          width: WIDTH - 240,
          top: 660,
          borderRadius: 44,
          backgroundColor: COLORS.surfaceRaised,
          border: "2px solid rgba(240,239,236,0.12)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          padding: "40px 48px",
          fontFamily: FONT_FAMILY,
          color: COLORS.ink,
          opacity: interpolate(frame, [aiStart, aiStart + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [aiStart, aiStart + 16], ["0px 80px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <Sfx name="notification" from={aiStart + 2} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 26 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: COLORS.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Glyph name="ai" size={36} color={COLORS.surfaceRaised} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 600, color: COLORS.inkMuted }}>Assistant IA</div>
        </div>
        <div style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.3, minHeight: 170 }}>
          <TypeText
            from={aiStart + 12}
            charsPerFrame={2.2}
            text="Bien sûr ! Voici 5 conseils pour mieux gérer vos mails : 1. Créez des dossiers…"
          />
        </div>
      </div>

      {/* "fait rien" stamp */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 1060,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [nothingStart, nothingStart + 3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [nothingStart, nothingStart + 10], [2.2, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.2, 0.3, 1),
            output: "perceptual-scale",
          }),
          rotate: "-6deg",
        }}
      >
        <Sfx name="stamp" from={nothingStart} />
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 120,
            fontWeight: 900,
            color: COLORS.error,
            border: `10px solid ${COLORS.error}`,
            borderRadius: 28,
            padding: "6px 40px",
            letterSpacing: -4,
            textTransform: "uppercase",
          }}
        >
          fait rien
        </div>
      </div>

      <Captions words={words} />
    </AbsoluteFill>
  );
};

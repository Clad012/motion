import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Glyph } from "@/generic/components/icons";
import { ResultRow } from "@/generic/components/ui";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";

const HANDLED = ["Newsletter · archivée", "Facture · classée dans Budget", "Confirmation Amazon · rangée", "Spam · supprimé"];
const NEEDS_YOU = ["Marc attend ta réponse sur le devis", "Le rdv de jeudi est déplacé à 11h"];

// Demo 3: overnight, the inbox gets processed and only two things surface.
export const DemoSleepScene: React.FC<SceneProps> = ({ words, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sortStart = wordFrame(words, "trie", 40) - 4;
  const surfaceStart = wordFrame(words, "compte", 100) - 6;
  const counter = Math.round(
    interpolate(frame, [sortStart, sortStart + 1.2 * fps], [0, 14], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="notification" from={sortStart} />
      <Sfx name="pop" from={surfaceStart} />

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          fontFamily: FONT_FAMILY,
          color: COLORS.ink,
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            rotate: interpolate(frame, [0, durationInFrames], ["-8deg", "8deg"]),
          }}
        >
          <Glyph name="moon" size={110} color={COLORS.ink} strokeWidth={1.8} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.inkMuted, letterSpacing: 5, textTransform: "uppercase" }}>
          pendant ton sommeil
        </div>
        <div style={{ fontSize: 150, fontWeight: 900, letterSpacing: -6, lineHeight: 1 }}>{counter}</div>
        <div style={{ fontSize: 52, fontWeight: 600, marginTop: -10 }}>mails traités</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          width: WIDTH - 240,
          top: 700,
          borderRadius: 40,
          backgroundColor: COLORS.surfaceRaised,
          border: "2px solid rgba(240,239,236,0.10)",
          padding: "34px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity: interpolate(frame, [sortStart, sortStart + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {HANDLED.map((h, i) => (
          <ResultRow key={h} label={h} from={sortStart + 6 + i * 6} width={WIDTH - 240} accent={COLORS.inkFaint} strike />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          width: WIDTH - 240,
          top: 1015,
          borderRadius: 40,
          backgroundColor: COLORS.ink,
          color: COLORS.surfaceRaised,
          padding: "34px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          fontFamily: FONT_FAMILY,
          boxShadow: "0 30px 80px rgba(240,239,236,0.12)",
          opacity: interpolate(frame, [surfaceStart, surfaceStart + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [surfaceStart, surfaceStart + 14], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.3, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", opacity: 0.6 }}>
          2 demandent ton attention
        </div>
        {NEEDS_YOU.map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 600 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: COLORS.warning, flexShrink: 0, opacity: frame > surfaceStart + 8 + i * 6 ? 1 : 0 }} />
            {n}
          </div>
        ))}
      </div>

      <Captions words={words} />
    </AbsoluteFill>
  );
};

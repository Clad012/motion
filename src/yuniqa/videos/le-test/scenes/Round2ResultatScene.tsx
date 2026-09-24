import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Glyph } from "@/generic/components/icons";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { BOTTOM_PANEL_Y, CAPTION_Y, PromptPill, TOP_PANEL_Y, TestPanel } from "../components/TestPanel";

// One says it cannot browse. The other sets the watch and keeps it running.
export const Round2ResultatScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const refuseAt = wordFrame(words, "je", 24) - 4;
  const alertAt = wordFrame(words, "alerte", 83) - 6;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="error" from={refuseAt + 6} />
      <Sfx name="notification" from={alertAt} />

      <PromptPill from={0}>Préviens-moi si ce prix baisse</PromptPill>

      <TestPanel
        variant="classique"
        label="IA classique"
        top={TOP_PANEL_Y}
        from={0}
        badge="impossible"
        badgeAt={refuseAt + 6}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 42,
            fontWeight: 500,
            lineHeight: 1.35,
            color: COLORS.inkMuted,
            opacity: interpolate(frame, [refuseAt, refuseAt + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          « Je n'ai pas accès à internet et je ne peux pas suivre un prix pour vous. »
        </div>
      </TestPanel>

      <TestPanel
        variant="agent"
        label="l'autre"
        top={BOTTOM_PANEL_Y}
        from={0}
        badge="en veille"
        badgeAt={alertAt + 10}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: interpolate(frame, [alertAt, alertAt + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              backgroundColor: COLORS.warning,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Glyph name="bell" size={52} color="#0b0b0b" strokeWidth={2.4} />
          </div>
          <div style={{ fontFamily: FONT_FAMILY }}>
            <div style={{ fontSize: 44, fontWeight: 700 }}>Alerte posée</div>
            <div style={{ fontSize: 34, fontWeight: 500, color: COLORS.inkMuted, marginTop: 6 }}>
              AirPods Pro · te prévient sous 249 €
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 26,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: FONT_FAMILY,
            fontSize: 32,
            fontWeight: 500,
            color: COLORS.inkMuted,
            opacity: interpolate(frame, [alertAt + 16, alertAt + 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: COLORS.success,
              opacity: interpolate(frame % 30, [0, 15, 29], [1, 0.3, 1]),
            }}
          />
          elle surveille, même quand tu fermes l'app
        </div>
      </TestPanel>

      <Captions words={words} y={CAPTION_Y} />
    </AbsoluteFill>
  );
};

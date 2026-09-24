import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";
import {
  BOTTOM_PANEL_Y,
  CAPTION_Y,
  PromptPill,
  TOP_PANEL_Y,
  TestPanel,
  ThinkingDots,
} from "../components/TestPanel";

const ADVICE = [
  "1. Créez des dossiers par expéditeur",
  "2. Utilisez des filtres automatiques",
  "3. Traitez vos mails deux fois par jour",
];

// The classic assistant answers with advice instead of doing the job.
export const Reponse1Scene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const listStart = wordFrame(words, "creez", 46) - 10;
  const badgeAt = wordFrame(words, "cours", 132) - 6;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="click" from={listStart} />
      <Sfx name="error" from={badgeAt} />

      <PromptPill from={0}>Trie ma boîte mail et fais-en des tâches</PromptPill>

      <TestPanel
        variant="classique"
        label="IA classique"
        top={TOP_PANEL_Y}
        from={0}
        badge="0 action"
        badgeAt={badgeAt}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {ADVICE.map((line, i) => {
            const start = listStart + i * 10;
            return (
              <div
                key={line}
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 38,
                  fontWeight: 500,
                  color: COLORS.inkMuted,
                  opacity: interpolate(frame, [start, start + 7], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {line}
              </div>
            );
          })}
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 34,
              fontWeight: 500,
              color: COLORS.inkMuted,
              opacity: interpolate(frame, [listStart + 32, listStart + 40], [0, 0.6], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            …et 7 autres conseils
          </div>
        </div>
      </TestPanel>

      <TestPanel variant="agent" label="l'autre" top={BOTTOM_PANEL_Y} from={0} dimmed>
        <ThinkingDots from={0} color={COLORS.ink} />
      </TestPanel>

      <Captions words={words} y={CAPTION_Y} />
    </AbsoluteFill>
  );
};

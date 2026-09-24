import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { ResultRow } from "@/generic/components/ui";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { BOTTOM_PANEL_Y, CAPTION_Y, PANEL_WIDTH, PromptPill, TOP_PANEL_Y, TestPanel } from "../components/TestPanel";

const DONE = ["12 mails lus", "9 archivés", "3 tâches créées avec échéance"];

// The other one actually opened the inbox.
export const Reponse2Scene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const first = wordFrame(words, "douze", 45) - 6;
  const steps = [first, wordFrame(words, "neuf", 69) - 6, wordFrame(words, "trois", 91) - 6];
  const badgeAt = steps[2] + 8;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="pop" from={first} />
      <Sfx name="success" from={badgeAt} />

      <PromptPill from={0}>Trie ma boîte mail et fais-en des tâches</PromptPill>

      <TestPanel
        variant="classique"
        label="IA classique"
        top={TOP_PANEL_Y}
        from={0}
        badge="0 action"
        badgeAt={0}
        dimmed
      >
        <div style={{ fontFamily: FONT_FAMILY, fontSize: 38, fontWeight: 500, color: COLORS.inkMuted }}>
          « Créez des dossiers, utilisez des filtres… »
        </div>
      </TestPanel>

      <TestPanel variant="agent" label="l'autre" top={BOTTOM_PANEL_Y} from={0} badge="fait" badgeAt={badgeAt}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {DONE.map((label, i) => (
            <ResultRow key={label} label={label} from={steps[i]} width={PANEL_WIDTH} />
          ))}
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: FONT_FAMILY,
            fontSize: 32,
            fontWeight: 500,
            color: COLORS.inkMuted,
            opacity: interpolate(frame, [badgeAt, badgeAt + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          boîte à zéro en 40 secondes
        </div>
      </TestPanel>

      <Captions words={words} y={CAPTION_Y} />
    </AbsoluteFill>
  );
};

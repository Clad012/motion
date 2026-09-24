import { AbsoluteFill } from "remotion";
import { COLORS } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Sfx } from "@/yuniqa/components";
import { TypeText } from "@/generic/components/text";
import { wordFrame, type SceneProps } from "@/generic/engine";
import {
  BOTTOM_PANEL_Y,
  CAPTION_Y,
  PromptPill,
  TOP_PANEL_Y,
  TestPanel,
  ThinkingDots,
} from "../components/TestPanel";

// The prompt is typed once and sent to both sides.
export const QuestionScene: React.FC<SceneProps> = ({ words }) => {
  const typeStart = wordFrame(words, "trie", 21) - 8;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="keyboard" from={typeStart} />

      <PromptPill from={typeStart}>
        <TypeText text="Trie ma boîte mail et fais-en des tâches" from={typeStart + 2} charsPerFrame={1.7} />
      </PromptPill>

      <TestPanel variant="classique" label="IA classique" top={TOP_PANEL_Y} from={0}>
        <ThinkingDots from={typeStart} />
      </TestPanel>

      <TestPanel variant="agent" label="l'autre" top={BOTTOM_PANEL_Y} from={0}>
        <ThinkingDots from={typeStart} color={COLORS.ink} />
      </TestPanel>

      <Captions words={words} y={CAPTION_Y} />
    </AbsoluteFill>
  );
};

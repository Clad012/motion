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

// Round two: a request that needs the outside world.
export const Round2Scene: React.FC<SceneProps> = ({ words }) => {
  const typeStart = wordFrame(words, "previens", 27) - 8;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="swipe" from={0} />
      <Sfx name="keyboard" from={typeStart} />

      <PromptPill from={typeStart}>
        <TypeText text="Préviens-moi si ce prix baisse" from={typeStart + 2} charsPerFrame={1.7} />
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

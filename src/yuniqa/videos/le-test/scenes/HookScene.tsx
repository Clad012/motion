import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Sfx } from "@/yuniqa/components";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { BOTTOM_PANEL_Y, CAPTION_Y, TOP_PANEL_Y, TestPanel, ThinkingDots } from "../components/TestPanel";

// Hook: two assistants, one question, and a hint that only one will deliver.
export const HookScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const twoStart = wordFrame(words, "deux", 36) - 6;
  const oneStart = wordFrame(words, "seule", 63) - 4;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="whoosh" from={0} />
      <Sfx name="pop" from={twoStart} />

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 190,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 64,
          fontWeight: 900,
          letterSpacing: -2,
          color: COLORS.ink,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        même question, deux IA
      </div>

      <TestPanel variant="classique" label="IA classique" top={TOP_PANEL_Y} from={twoStart}>
        <ThinkingDots from={twoStart} />
      </TestPanel>

      <TestPanel variant="agent" label="l'autre" top={BOTTOM_PANEL_Y} from={twoStart + 6}>
        <ThinkingDots from={twoStart + 6} color={COLORS.ink} />
      </TestPanel>

      {/* VS badge between the two panels */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: TOP_PANEL_Y + 470 - 34,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [twoStart + 8, twoStart + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [twoStart + 8, twoStart + 20], [0.3, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.5, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <div
          style={{
            width: 116,
            height: 116,
            borderRadius: "50%",
            backgroundColor: COLORS.ink,
            color: COLORS.surfaceRaised,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 46,
            fontWeight: 900,
            letterSpacing: -1,
            border: "8px solid #080808",
          }}
        >
          VS
        </div>
      </div>

      {/* Spotlight on the winner */}
      <div
        style={{
          position: "absolute",
          left: 60,
          width: WIDTH - 120,
          height: 530,
          top: BOTTOM_PANEL_Y - 30,
          borderRadius: 60,
          background: "radial-gradient(ellipse at center, rgba(240,239,236,0.12) 0%, rgba(240,239,236,0) 70%)",
          opacity: interpolate(frame, [oneStart, oneStart + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      <Captions words={words} y={CAPTION_Y} />
    </AbsoluteFill>
  );
};

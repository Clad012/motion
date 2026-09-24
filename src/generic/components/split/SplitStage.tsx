import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { WIDTH } from "../../engine/format";
import { useTheme } from "../../engine/theme";
import type { VoiceoverWord } from "../../engine/voiceover";
import { Background } from "../backgrounds/Background";
import { Captions } from "../text/Captions";
import { SplitPanel } from "./SplitPanel";
import { BOTTOM_PANEL_Y, CAPTION_Y, HEADER_Y, TOP_PANEL_Y } from "./layout";

type Side = {
  readonly label: string;
  readonly badge?: string;
  readonly badgeAt?: number;
  readonly dimmed?: boolean;
  readonly from?: number;
  readonly content: ReactNode;
};

type SplitStageProps = {
  readonly words: VoiceoverWord[];
  readonly header?: string;
  readonly top: Side;
  readonly bottom: Side;
  /** Extra layers drawn above the panels (badges, overlays). */
  readonly children?: ReactNode;
};

// Background, optional headline, the two panels and the captions: everything a
// split-screen scene needs, so scenes only describe their content.
export const SplitStage: React.FC<SplitStageProps> = ({ words, header, top, bottom, children }) => {
  const { colors, fonts } = useTheme();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Background />
      {header ? (
        <div
          style={{
            position: "absolute",
            left: 60,
            width: WIDTH - 120,
            top: HEADER_Y,
            textAlign: "center",
            fontFamily: fonts.sans,
            fontSize: 60,
            fontWeight: 900,
            letterSpacing: -2,
            color: colors.ink,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {header}
        </div>
      ) : null}

      <SplitPanel
        side="before"
        label={top.label}
        top={TOP_PANEL_Y}
        from={top.from ?? 0}
        badge={top.badge}
        badgeAt={top.badgeAt}
        dimmed={top.dimmed}
      >
        {top.content}
      </SplitPanel>

      <SplitPanel
        side="after"
        label={bottom.label}
        top={BOTTOM_PANEL_Y}
        from={bottom.from ?? 0}
        badge={bottom.badge}
        badgeAt={bottom.badgeAt}
        dimmed={bottom.dimmed}
      >
        {bottom.content}
      </SplitPanel>

      {children}
      <Captions words={words} y={CAPTION_Y} />
    </AbsoluteFill>
  );
};

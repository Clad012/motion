import { useMemo } from "react";
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { HEIGHT, SAFE, WIDTH } from "../../engine/format";
import { useTheme } from "../../engine/theme";
import type { VoiceoverWord } from "../../engine/voiceover";

const SWITCH_CAPTIONS_EVERY_MS = 1100;

type CaptionsProps = {
  readonly words: VoiceoverWord[];
  /** Vertical position of the caption block center, px from top. */
  readonly y?: number;
  readonly fontSize?: number;
  readonly tone?: "dark" | "light";
};

const CaptionPage: React.FC<{
  readonly page: TikTokPage;
  readonly fontSize: number;
  readonly tone: "dark" | "light";
}> = ({ page, fontSize, tone }) => {
  const { colors, fonts, captionHighlight } = useTheme();
  const highlight = captionHighlight ?? colors.warning;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteTimeMs = page.startMs + (frame / fps) * 1000;
  const isDark = tone === "dark";

  return (
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: 900,
        fontSize,
        lineHeight: 1.12,
        textAlign: "center",
        whiteSpace: "pre-wrap",
        color: isDark ? colors.ink : colors.surfaceRaised,
        textShadow: isDark
          ? "0 4px 24px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.9)"
          : "0 2px 12px rgba(240,239,236,0.8)",
        letterSpacing: -1,
      }}
    >
      {page.tokens.map((token, i) => {
        const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
        const isPast = token.toMs <= absoluteTimeMs;
        return (
          <span
            key={`${token.fromMs}-${i}`}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              color: isActive ? (isDark ? highlight : colors.surfaceRaised) : undefined,
              opacity: isActive || isPast ? 1 : 0.55,
              // No scale on the active word: the enlarged glyphs visually swallow the
              // neighbouring spaces. A small lift keeps the pop without touching layout.
              translate: isActive ? "0px -4px" : "0px 0px",
            }}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
};

// TikTok-style captions driven by ElevenLabs word timestamps.
// Time is local to the scene: frame 0 == start of that scene's voice line.
export const Captions: React.FC<CaptionsProps> = ({
  words,
  y = HEIGHT - SAFE.bottom - 120,
  fontSize = 62,
  tone = "dark",
}) => {
  const { fps } = useVideoConfig();

  const { pages } = useMemo(() => {
    const captions: Caption[] = words.map((w, i) => ({
      text: `${i === 0 ? "" : " "}${w.text}`,
      startMs: w.startMs,
      endMs: w.endMs,
      timestampMs: null,
      confidence: null,
    }));
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [words]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.round(
          Math.min(
            nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
            ((page.startMs + page.durationMs) / 1000) * fps + 0.35 * fps,
          ),
        );
        const durationInFrames = endFrame - startFrame;
        if (durationInFrames <= 0) {
          return null;
        }
        return (
          <Sequence key={index} from={startFrame} durationInFrames={durationInFrames} layout="none">
            <div
              style={{
                position: "absolute",
                left: SAFE.x,
                width: WIDTH - SAFE.x * 2,
                top: y,
                translate: "0 -50%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CaptionPage page={page} fontSize={fontSize} tone={tone} />
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

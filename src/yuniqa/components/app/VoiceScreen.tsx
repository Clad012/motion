import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../../brand";
import type { VoiceoverWord } from "@/generic/engine";
import { voiceLevel } from "@/generic/components/voice";
import { VoiceOrb } from "./VoiceOrb";
import { SCREEN_HEIGHT_BASE } from "@/generic/components/device";

type VoiceScreenProps = {
  readonly scale: number;
  /** Words driving the orb; usually the words of the current scene. */
  readonly words: VoiceoverWord[];
  readonly status: string;
  /** Live transcript of what is being said, revealed word by word. */
  readonly transcript?: string;
  readonly transcriptFrom?: number;
  readonly idle?: boolean;
  /** Share of the screen height left free at the bottom for the captions. */
  readonly bottomReserve?: number;
};

// The live voice screen: orb, state line, and the running transcript.
export const VoiceScreen: React.FC<VoiceScreenProps> = ({
  scale,
  words,
  status,
  transcript,
  transcriptFrom = 0,
  idle = false,
  bottomReserve = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const level = idle ? 0 : voiceLevel(words, frame, fps);

  const shown = transcript ? transcript.slice(0, Math.max(0, Math.floor((frame - transcriptFrom) * 1.5))) : "";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28 * scale,
        fontFamily: FONT_FAMILY,
        padding: `0 ${28 * scale}px`,
        paddingBottom: bottomReserve * SCREEN_HEIGHT_BASE * scale,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Halo reacting with the voice */}
        <div
          style={{
            position: "absolute",
            width: 300 * scale,
            height: 300 * scale,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(240,239,236,${0.05 + level * 0.13}) 0%, rgba(240,239,236,0) 65%)`,
            scale: `${1 + level * 0.2}`,
          }}
        />
        <VoiceOrb size={196 * scale} level={level} frame={frame} idle={idle} />
      </div>

      <div style={{ fontSize: 26 * scale, fontWeight: 600, color: COLORS.inkMuted, letterSpacing: 0.5 }}>{status}</div>

      {transcript ? (
        <div
          style={{
            marginTop: 6 * scale,
            padding: `${16 * scale}px ${22 * scale}px`,
            borderRadius: 28 * scale,
            backgroundColor: "rgba(240,239,236,0.08)",
            color: COLORS.ink,
            fontSize: 25 * scale,
            fontWeight: 500,
            lineHeight: 1.32,
            textAlign: "center",
            minHeight: 40 * scale,
            opacity: interpolate(frame, [transcriptFrom, transcriptFrom + 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: `${interpolate(frame, [transcriptFrom, transcriptFrom + 12], [0.9, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1.3, 0.3, 1),
            })}`,
          }}
        >
          {shown}
        </div>
      ) : null}
    </div>
  );
};

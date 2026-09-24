import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Captions } from "@/generic/components/text";
import { ChatScreen, type ChatMessage } from "@/generic/components/chat";
import { IPHONE_RATIO, IPhone } from "@/generic/components/device";
import type { VoiceoverWord } from "@/generic/engine";
import { LogoMark } from "@/yuniqa/components";

export const PHONE_WIDTH = 428;
export const PHONE_SCALE = PHONE_WIDTH / 430;
export const PHONE_TOP = 322;
export const PHONE_HEIGHT = PHONE_WIDTH * IPHONE_RATIO;
export const LEFT_X = 62;
export const RIGHT_X = WIDTH - PHONE_WIDTH - 62;
export const CAPTION_Y = 1420;

type Focus = "none" | "left" | "right";

type DuelStageProps = {
  readonly words: VoiceoverWord[];
  readonly left: ChatMessage[];
  readonly right: ChatMessage[];
  readonly focus?: Focus;
  /** Frame at which the focus shift happens. */
  readonly focusAt?: number;
  /** Phones fly in from the sides instead of being already there. */
  readonly entrance?: boolean;
  readonly header?: ReactNode;
  readonly rightBranded?: boolean;
  readonly children?: ReactNode;
};

// Two phones on a slow camera push, one of them lit at a time.
export const DuelStage: React.FC<DuelStageProps> = ({
  words,
  left,
  right,
  focus = "none",
  focusAt = 0,
  entrance = false,
  header,
  rightBranded = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slow push-in keeps the frame alive even when nothing else moves.
  const camera = interpolate(frame, [0, durationInFrames], [1, 1.035], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const focusProgress = interpolate(frame, [focusAt, focusAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const side = (which: "left" | "right") => {
    const isFocused = focus === which;
    const isOther = focus !== "none" && !isFocused;
    const enter = entrance
      ? interpolate(frame, [which === "left" ? 0 : 3, (which === "left" ? 0 : 3) + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.18, 1.35, 0.3, 1),
        })
      : 1;
    const baseTilt = which === "left" ? 11 : -11;
    return {
      x: which === "left" ? LEFT_X : RIGHT_X,
      offsetX: interpolate(enter, [0, 1], [which === "left" ? -700 : 700, 0]),
      tilt: baseTilt * (1 - (isFocused ? focusProgress : 0)),
      scale: 1 + (isFocused ? 0.045 * focusProgress : 0) - (isOther ? 0.03 * focusProgress : 0),
      opacity: enter * (isOther ? 1 - 0.42 * focusProgress : 1),
      blur: isOther ? 2.4 * focusProgress : 0,
      lift: isFocused ? -18 * focusProgress : 0,
      rotate: interpolate(enter, [0, 1], [which === "left" ? -14 : 14, 0]),
    };
  };

  const l = side("left");
  const r = side("right");

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Backdrop */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(240,239,236,0.09) 0%, rgba(240,239,236,0) 58%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(240,239,236,0.09) 1.5px, transparent 1.5px)",
          backgroundSize: "46px 46px",
          opacity: 0.35,
        }}
      />

      <AbsoluteFill style={{ scale: `${camera}`, transformOrigin: "50% 46%" }}>
        {header}

        {([
          ["left", l, left, false] as const,
          ["right", r, right, rightBranded] as const,
        ]).map(([which, s, messages, branded]) => (
          <div
            key={which}
            style={{
              position: "absolute",
              left: s.x,
              top: PHONE_TOP,
              width: PHONE_WIDTH,
              height: PHONE_HEIGHT,
              opacity: s.opacity,
              filter: s.blur > 0.05 ? `blur(${s.blur}px)` : undefined,
              translate: `${s.offsetX}px ${s.lift}px`,
              rotate: `${s.rotate}deg`,
              scale: `${s.scale}`,
            }}
          >
            <IPhone width={PHONE_WIDTH} tiltY={s.tilt} time="19:04">
              <ChatScreen
                scale={PHONE_SCALE}
                title={which === "left" ? "IA n° 1" : "IA n° 2"}
                messages={messages}
                avatar={branded ? <LogoMark size={30 * PHONE_SCALE} color={COLORS.surfaceRaised} progress={1} /> : undefined}
                avatarBackground={branded ? COLORS.ink : undefined}
              />
            </IPhone>
          </div>
        ))}
      </AbsoluteFill>

      {children}
      <Captions words={words} y={CAPTION_Y} />
    </AbsoluteFill>
  );
};

// Label chip drawn above a phone.
export const SideLabel: React.FC<{
  readonly side: "left" | "right";
  readonly text: string;
  readonly from: number;
  readonly tone?: "bad" | "good";
}> = ({ side, text, from, tone }) => {
  const frame = useCurrentFrame();
  const background = tone === "bad" ? COLORS.error : tone === "good" ? COLORS.success : "rgba(240,239,236,0.12)";
  return (
    <div
      style={{
        position: "absolute",
        left: side === "left" ? LEFT_X : RIGHT_X,
        width: PHONE_WIDTH,
        top: PHONE_TOP - 74,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [from, from + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: interpolate(frame, [from, from + 14], [0.6, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 1.5, 0.3, 1),
          output: "perceptual-scale",
        }),
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: tone ? "#0b0b0b" : COLORS.ink,
          backgroundColor: background,
          padding: "10px 24px",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

import type { ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WIDTH } from "../../engine/format";
import { Captions } from "../text/Captions";
import { IPhone, IPHONE_RATIO } from "./IPhone";
import type { VoiceoverWord } from "../../engine/voiceover";

export const PHONE_WIDTH = 764;
export const PHONE_HEIGHT = PHONE_WIDTH * IPHONE_RATIO;
export const PHONE_X = (WIDTH - PHONE_WIDTH) / 2;
export const PHONE_TOP = 96;
export const SCREEN_SCALE = PHONE_WIDTH / 430;
export const CAPTION_Y = 1478;

type CloseUpStageProps = {
  readonly words: VoiceoverWord[];
  /** Photo of the room behind the phone, relative to public/ (e.g. "yuniqa/images/fond-bureau.png"). */
  readonly background: string;
  readonly children: ReactNode;
  /** Slight variation so two consecutive scenes never look identical. */
  readonly seed?: number;
  readonly overlay?: ReactNode;
  readonly captionWords?: VoiceoverWord[];
  /** Colour wash over the room, e.g. a red for the "problem" half of a story. */
  readonly tint?: string;
};

// The look the user picked: the phone, close, on a real room. Camera pushes in and the device settles upright.
export const CloseUpStage: React.FC<CloseUpStageProps> = ({
  words,
  background,
  children,
  seed = 0,
  overlay,
  captionWords,
  tint,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.4, 1),
  });
  const direction = seed % 2 === 0 ? 1 : -1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0908", overflow: "hidden" }}>
      <Img
        src={staticFile(background)}
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          left: "-10%",
          top: "-10%",
          objectFit: "cover",
          filter: "blur(7px) brightness(0.45) saturate(0.9)",
          scale: `${interpolate(t, [0, 1], [1, 1.06])}`,
          translate: `${direction * t * 26}px ${t * -14}px`,
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.72) 100%)" }}
      />
      {tint ? <AbsoluteFill style={{ backgroundColor: tint }} /> : null}

      <div
        style={{
          position: "absolute",
          left: PHONE_X,
          top: PHONE_TOP,
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          transformOrigin: "50% 38%",
          scale: `${interpolate(t, [0, 1], [1, 1.055])}`,
          rotate: `${interpolate(t, [0, 1], [direction * -1.6, direction * 0.4])}deg`,
        }}
      >
        <IPhone width={PHONE_WIDTH} time="19:04" tiltY={interpolate(t, [0, 1], [direction * 5, direction * 1])}>
          {children}
        </IPhone>
      </div>

      {/* Grounds the phone and keeps the captions readable over it */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(8,8,8,0) 62%, rgba(8,8,8,0.55) 78%, rgba(8,8,8,0.95) 100%)",
          pointerEvents: "none",
        }}
      />

      {overlay}
      <Captions words={captionWords ?? words} y={CAPTION_Y} />
    </AbsoluteFill>
  );
};

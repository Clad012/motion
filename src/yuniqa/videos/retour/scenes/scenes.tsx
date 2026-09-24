import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "@/yuniqa/brand";
import { Captions } from "@/generic/components/text";
import { LogoMark } from "@/yuniqa/components";
import { Sfx } from "@/yuniqa/components";
import { CloseUpStage } from "@/generic/components/device";
import { CAPTION_Y, SCREEN_SCALE } from "@/generic/components/device";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { BriefScreen } from "../components/BriefScreen";
import { ChaosScreen } from "../components/ChaosScreen";

const RESERVE = 0.24;
const PROBLEM_TINT = "rgba(248,113,113,0.08)";

// ---------- The problem ----------

// Two days away: the lock screen fills up.
export const HookScene: React.FC<SceneProps> = ({ words }) => {
  const lookAt = wordFrame(words, "regarde", 57) - 4;
  return (
    <CloseUpStage words={words} background="yuniqa/images/fond-salon.png" seed={0} tint={PROBLEM_TINT}>
      <Sfx name="sweep" from={0} />
      {[4, 11, 18, 25, 32].map((f) => (
        <Sfx key={f} name="notification" from={f} />
      ))}
      <Sfx name="impact" from={lookAt} />
      <ChaosScreen scale={SCREEN_SCALE} mode="lock" bottomReserve={RESERVE} />
    </CloseUpStage>
  );
};

// 230 unread, the urgent one buried in the middle.
export const ChaosScene: React.FC<SceneProps> = ({ words }) => {
  const buriedAt = wordFrame(words, "noye", 82) - 4;
  return (
    <CloseUpStage words={words} background="yuniqa/images/fond-salon.png" seed={1} tint={PROBLEM_TINT}>
      <Sfx name="swipe" from={0} />
      <Sfx name="tick" from={8} />
      <Sfx name="tick" from={20} />
      <Sfx name="error" from={buriedAt} />
      <ChaosScreen scale={SCREEN_SCALE} mode="inbox" bottomReserve={RESERVE} />
    </CloseUpStage>
  );
};

// Sunday evening spent sorting.
export const TriScene: React.FC<SceneProps> = ({ words }) => {
  const scrollAt = wordFrame(words, "passes", 10) - 4;
  return (
    <CloseUpStage
      words={words}
      background="yuniqa/images/fond-salon.png"
      seed={2}
      tint="rgba(248,113,113,0.12)"
    >
      <Sfx name="swipe" from={scrollAt} />
      <Sfx name="swipe" from={scrollAt + 12} />
      <Sfx name="swipe" from={scrollAt + 24} />
      <Sfx name="swipe" from={scrollAt + 36} />
      <ChaosScreen
        scale={SCREEN_SCALE}
        mode="inbox"
        bottomReserve={RESERVE}
        scrollFrom={scrollAt}
        banner="21:47 · encore 180 à lire"
        bannerFrom={scrollAt + 10}
      />
    </CloseUpStage>
  );
};

// ---------- The fix ----------

// Same weekend, but someone kept watch.
export const BasculeScene: React.FC<SceneProps> = ({ words }) => {
  const watchAt = wordFrame(words, "quelqu'un", 70) - 6;
  return (
    <CloseUpStage words={words} background="yuniqa/images/fond-bureau.png" seed={3}>
      <Sfx name="sweep" from={0} />
      <Sfx name="listenOn" from={watchAt} />
      <BriefScreen scale={SCREEN_SCALE} bottomReserve={RESERVE} stage="loading" />
    </CloseUpStage>
  );
};

// Welcome back: the brief.
export const BriefScene: React.FC<SceneProps> = ({ words }) => {
  const backAt = wordFrame(words, "bon", 0);
  return (
    <CloseUpStage words={words} background="yuniqa/images/fond-bureau.png" seed={4}>
      <Sfx name="cardIn" from={backAt} />
      <Sfx name="confirm" from={backAt + 14} />
      <BriefScreen scale={SCREEN_SCALE} bottomReserve={RESERVE} stage="brief" headlineFrom={backAt + 2} />
    </CloseUpStage>
  );
};

// Everything handled while you slept.
export const TraiteScene: React.FC<SceneProps> = ({ words }) => {
  const openAt = wordFrame(words, "deux", 0);
  return (
    <CloseUpStage words={words} background="yuniqa/images/fond-bureau.png" seed={5}>
      <Sfx name="tap" from={openAt} />
      <Sfx name="cardIn" from={openAt + 2} />
      <Sfx name="ping" from={wordFrame(words, "neuf", 67)} />
      <Sfx name="ping" from={wordFrame(words, "trois", 110)} />
      <BriefScreen
        scale={SCREEN_SCALE}
        bottomReserve={RESERVE}
        stage="brief"
        headlineFrom={-100}
        handledFrom={-100}
        handledOpenFrom={openAt}
      />
    </CloseUpStage>
  );
};

// Only three things need you.
export const AttentionScene: React.FC<SceneProps> = ({ words }) => {
  const threeAt = wordFrame(words, "trois", 17) - 4;
  return (
    <CloseUpStage words={words} background="yuniqa/images/fond-bureau.png" seed={6}>
      <Sfx name="cardIn" from={threeAt} />
      <Sfx name="cardIn" from={threeAt + 8} />
      <Sfx name="cardIn" from={threeAt + 16} />
      <BriefScreen
        scale={SCREEN_SCALE}
        bottomReserve={RESERVE}
        stage="brief"
        headlineFrom={-100}
        attentionFrom={[threeAt, threeAt + 8, threeAt + 16]}
        compact
      />
    </CloseUpStage>
  );
};

// Each one dealt with in a tap.
export const ActionsScene: React.FC<SceneProps> = ({ words }) => {
  const marc = wordFrame(words, "redigee", 60) + 4;
  const netflix = wordFrame(words, "augmente", 101) + 4;
  const edf = wordFrame(words, "retard", 135) + 4;
  const doneAt = wordFrame(words, "regle", 180) - 4;
  return (
    <CloseUpStage words={words} background="yuniqa/images/fond-bureau.png" seed={7}>
      {[marc, netflix, edf].map((f) => (
        <Sfx key={f} name="tap" from={f} />
      ))}
      {[marc, netflix, edf].map((f) => (
        <Sfx key={`ok-${f}`} name="ping" from={f + 6} />
      ))}
      <Sfx name="confirm" from={doneAt} />
      <BriefScreen
        scale={SCREEN_SCALE}
        bottomReserve={RESERVE}
        stage="brief"
        headlineFrom={-100}
        attentionFrom={[-100, -100, -100]}
        actionAt={[marc, netflix, edf]}
        compact
      />
    </CloseUpStage>
  );
};

// Two hours, or two minutes.
export const VerdictScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const hoursAt = wordFrame(words, "deux", 0);
  const minutesAt = wordFrame(words, "ou", 25) - 2;

  const big = (text: string, sub: string, from: number, color: string, struck: boolean) => (
    <div
      style={{
        position: "relative",
        textAlign: "center",
        opacity: interpolate(frame, [from, from + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: `${interpolate(frame, [from, from + 14], [1.3, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 1.3, 0.3, 1),
        })}`,
      }}
    >
      <div style={{ fontSize: 118 * SCREEN_SCALE * 0.85, fontWeight: 900, letterSpacing: -4, color, lineHeight: 1 }}>{text}</div>
      <div style={{ fontSize: 22 * SCREEN_SCALE * 0.8, fontWeight: 600, color: COLORS.inkMuted, marginTop: 8 }}>{sub}</div>
      {struck ? (
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: "34%",
            height: 8,
            borderRadius: 999,
            backgroundColor: COLORS.error,
            width: `${interpolate(frame, [from + 8, from + 20], [0, 80], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}%`,
          }}
        />
      ) : null}
    </div>
  );

  return (
    <CloseUpStage words={words} background="yuniqa/images/fond-bureau.png" seed={8}>
      <Sfx name="impact" from={hoursAt} />
      <Sfx name="confirm" from={minutesAt} />
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
          paddingBottom: "24%",
          fontFamily: FONT_FAMILY,
        }}
      >
        {big("2 h", "de tri, chaque dimanche", hoursAt, COLORS.inkMuted, true)}
        {big("2 min", "et tout est réglé", minutesAt, COLORS.success, false)}
      </div>
    </CloseUpStage>
  );
};

// Reveal: the screen becomes the brand, then the brand takes the frame.
export const RevealScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const brand = wordFrame(words, "yuniqa", 18) - 10;
  const takeover = interpolate(frame, [brand, brand + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Sfx name="sweep" from={0} />
      <Sfx name="swell" from={brand} />

      <CloseUpStage words={words} captionWords={[]} background="yuniqa/images/fond-bureau.png" seed={9}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            backgroundColor: COLORS.ink,
          }}
        >
          <LogoMark size={260} color={COLORS.surfaceRaised} progress={1} />
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 92, fontWeight: 700, letterSpacing: -4, color: COLORS.surfaceRaised }}>
            yuniqa
          </div>
        </div>
      </CloseUpStage>

      <AbsoluteFill style={{ backgroundColor: COLORS.ink, clipPath: `circle(${takeover * 125}% at 50% 40%)` }} />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          paddingBottom: 200,
          opacity: interpolate(frame, [brand + 6, brand + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <LogoMark
          size={420}
          color={COLORS.surfaceRaised}
          progress={interpolate(frame, [brand + 6, brand + 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 160,
            fontWeight: 700,
            letterSpacing: -8,
            color: COLORS.surfaceRaised,
            lineHeight: 1,
            opacity: interpolate(frame, [brand + 18, brand + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          yuniqa
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 46,
            fontWeight: 500,
            color: "rgba(28,28,26,0.6)",
            letterSpacing: 2,
            opacity: interpolate(frame, [brand + 28, brand + 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          il veille pendant ton absence
        </div>
      </AbsoluteFill>

      <Captions words={words} y={CAPTION_Y} tone={frame >= brand + 8 ? "light" : "dark"} />
    </AbsoluteFill>
  );
};

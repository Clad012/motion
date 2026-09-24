import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, HEIGHT, WIDTH } from "@/yuniqa/brand";
import { Captions } from "@/generic/components/text";
import { LogoMark } from "@/yuniqa/components";
import { Sfx } from "@/yuniqa/components";
import type { ChatMessage } from "@/generic/components/chat";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { CAPTION_Y, DuelStage, SideLabel } from "../components/DuelStage";
import {
  ASK_CLIENT,
  ASK_DINNER,
  LEFT_CLIENT_REPLY,
  LEFT_DINNER_REPLY,
  RIGHT_CLIENT_REPLY,
  RIGHT_DINNER_REPLY,
  past,
} from "../messages";

const ask = (id: string, text: string, from: number): ChatMessage => ({ id, role: "user", text, from });
const reply = (id: string, text: string, from: number, typingFor = 20): ChatMessage => ({
  id,
  role: "assistant",
  text,
  from,
  typingFor,
});

// Hook: both phones slam in, the stake is on screen in the first second.
export const HookScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const lossAt = wordFrame(words, "perdre", 73) - 6;

  return (
    <DuelStage
      words={words}
      entrance
      left={[]}
      right={[]}
      header={
        <div
          style={{
            position: "absolute",
            left: 60,
            width: WIDTH - 120,
            top: 150,
            textAlign: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: -3,
            color: COLORS.ink,
            opacity: interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            scale: interpolate(frame, [0, 10], [1.35, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1.3, 0.3, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          la même question
        </div>
      }
    >
      <Sfx name="impact" from={0} />
      <Sfx name="whip" from={0} />
      <Sfx name="whip" from={3} />
      <Sfx name="error" from={lossAt} />

      {/* Opening flash */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.ink,
          opacity: interpolate(frame, [0, 3, 9], [0.55, 0.2, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      <SideLabel side="left" text="− 10 min" from={lossAt} tone="bad" />
      <SideLabel side="right" text="0 min" from={lossAt + 6} tone="good" />
    </DuelStage>
  );
};

// The same message is sent to both at once.
export const QuestionScene: React.FC<SceneProps> = ({ words }) => {
  const sendAt = wordFrame(words, "on", 44) - 10;
  const message = ask("q1", ASK_DINNER, sendAt);
  return (
    <DuelStage words={words} left={[message]} right={[message]}>
      <Sfx name="keyboard" from={sendAt - 16} />
      <Sfx name="messageOut" from={sendAt} />
      <Sfx name="messageOut" from={sendAt + 2} />
    </DuelStage>
  );
};

// The first one hands the work back.
export const GaucheScene: React.FC<SceneProps> = ({ words }) => {
  const replyAt = wordFrame(words, "donnez", 18) - 4;
  return (
    <DuelStage
      words={words}
      focus="left"
      focusAt={0}
      left={[past(ask("q1", ASK_DINNER, 0)), reply("a1", LEFT_DINNER_REPLY, replyAt, 22)]}
      right={[past(ask("q1", ASK_DINNER, 0))]}
    >
      <Sfx name="whip" from={0} />
      <Sfx name="messageIn" from={replyAt} />
      <SideLabel side="left" text="redemande tout" from={replyAt + 8} tone="bad" />
    </DuelStage>
  );
};

// The second one already knows the answer.
export const DroiteScene: React.FC<SceneProps> = ({ words }) => {
  const replyAt = wordFrame(words, "allergique", 18) - 10;
  return (
    <DuelStage
      words={words}
      focus="right"
      focusAt={0}
      left={[past(ask("q1", ASK_DINNER, 0)), past(reply("a1", LEFT_DINNER_REPLY, 0))]}
      right={[past(ask("q1", ASK_DINNER, 0)), reply("a2", RIGHT_DINNER_REPLY, replyAt, 18)]}
    >
      <Sfx name="whip" from={0} />
      <Sfx name="messageIn" from={replyAt} />
      <Sfx name="success" from={wordFrame(words, "voila", 122) - 4} />
      <SideLabel side="right" text="il sait déjà" from={replyAt + 10} tone="good" />
    </DuelStage>
  );
};

// Round two, deliberately vaguer.
export const Round2Scene: React.FC<SceneProps> = ({ words }) => {
  const sendAt = wordFrame(words, "relance", 56) - 12;
  const message = ask("q2", ASK_CLIENT, sendAt);
  const history = (extra: ChatMessage) => [past(ask("q1", ASK_DINNER, 0)), past(extra), message];
  return (
    <DuelStage
      words={words}
      left={history(reply("a1", LEFT_DINNER_REPLY, 0))}
      right={history(reply("a2", RIGHT_DINNER_REPLY, 0))}
    >
      <Sfx name="whip" from={0} />
      <Sfx name="keyboard" from={sendAt - 14} />
      <Sfx name="messageOut" from={sendAt} />
      <Sfx name="messageOut" from={sendAt + 2} />
    </DuelStage>
  );
};

// One asks which client, the other has the follow-up written.
export const Round2ResultatScene: React.FC<SceneProps> = ({ words }) => {
  const leftAt = wordFrame(words, "quel", 17) - 6;
  const rightAt = wordFrame(words, "marc", 55) - 12;
  const focusAt = rightAt - 6;
  return (
    <DuelStage
      words={words}
      focus="right"
      focusAt={focusAt}
      left={[
        past(ask("q1", ASK_DINNER, 0)),
        past(reply("a1", LEFT_DINNER_REPLY, 0)),
        past(ask("q2", ASK_CLIENT, 0)),
        reply("b1", LEFT_CLIENT_REPLY, leftAt, 12),
      ]}
      right={[
        past(ask("q1", ASK_DINNER, 0)),
        past(reply("a2", RIGHT_DINNER_REPLY, 0)),
        past(ask("q2", ASK_CLIENT, 0)),
        reply("b2", RIGHT_CLIENT_REPLY, rightAt, 14),
      ]}
    >
      <Sfx name="whip" from={0} />
      <Sfx name="messageIn" from={leftAt} />
      <Sfx name="error" from={leftAt + 8} />
      <Sfx name="messageIn" from={rightAt} />
      <Sfx name="success" from={wordFrame(words, "ecrit", 149) - 6} />
      <SideLabel side="left" text="aucune idée" from={leftAt + 8} tone="bad" />
      <SideLabel side="right" text="mail prêt" from={rightAt + 12} tone="good" />
    </DuelStage>
  );
};

// Verdict over both phones.
export const VerdictScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const leftAt = wordFrame(words, "l'une", 0);
  const rightAt = wordFrame(words, "l'autre", 40) - 2;

  const line = (text: string, from: number, color: string, strike: boolean) => (
    <div
      style={{
        position: "relative",
        fontFamily: FONT_FAMILY,
        fontSize: 74,
        fontWeight: 900,
        letterSpacing: -3,
        color,
        textAlign: "center",
        opacity: interpolate(frame, [from, from + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: interpolate(frame, [from, from + 13], [1.3, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 1.3, 0.3, 1),
          output: "perceptual-scale",
        }),
      }}
    >
      {text}
      {strike ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "52%",
            height: 8,
            borderRadius: 999,
            backgroundColor: COLORS.error,
            width: `${interpolate(frame, [from + 6, from + 18], [0, 100], {
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
    <DuelStage
      words={words}
      left={[past(reply("a1", LEFT_DINNER_REPLY, 0)), past(reply("b1", LEFT_CLIENT_REPLY, 0))]}
      right={[past(reply("a2", RIGHT_DINNER_REPLY, 0)), past(reply("b2", RIGHT_CLIENT_REPLY, 0))]}
    >
      <Sfx name="impact" from={leftAt} />
      <Sfx name="stamp" from={rightAt} />
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(8,8,8,0.82)",
          opacity: interpolate(frame, [leftAt - 6, leftAt], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 96,
          paddingBottom: 250,
        }}
      >
        {line("elle demande qui tu es", leftAt, COLORS.inkMuted, true)}
        {line("elle le sait déjà", rightAt, COLORS.ink, false)}
      </AbsoluteFill>
    </DuelStage>
  );
};

// Reveal: the right phone comes to the middle, then the brand takes the frame.
export const RevealScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const brand = wordFrame(words, "yuniqa", 31) - 6;

  const takeover = interpolate(frame, [brand, brand + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Sfx name="whip" from={0} />
      <Sfx name="magicReveal" from={brand} />

      <DuelStage
        words={[]}
        focus="right"
        focusAt={0}
        rightBranded={frame >= brand - 10}
        left={[past({ id: "a1", role: "assistant", text: LEFT_DINNER_REPLY, from: 0 })]}
        right={[past({ id: "a2", role: "assistant", text: RIGHT_DINNER_REPLY, from: 0 })]}
      />

      {/* Brand takeover */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.ink,
          clipPath: `circle(${takeover * 130}% at 72% 46%)`,
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          paddingBottom: 200,
          opacity: interpolate(frame, [brand + 6, brand + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <LogoMark
          size={420}
          color={COLORS.surfaceRaised}
          progress={interpolate(frame, [brand + 6, brand + 32], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 160,
            fontWeight: 700,
            letterSpacing: -8,
            color: COLORS.surfaceRaised,
            lineHeight: 1,
            opacity: interpolate(frame, [brand + 18, brand + 26], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
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
            opacity: interpolate(frame, [brand + 28, brand + 38], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          l'IA qui te connaît
        </div>
      </AbsoluteFill>

      <Captions words={words} y={CAPTION_Y} tone={frame >= brand + 8 ? "light" : "dark"} />
      <AbsoluteFill style={{ display: "none", height: HEIGHT }} />
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { ChatBubble } from "@/generic/components/chat";
import { PhoneFrame } from "@/generic/components/device";
import { ResultRow } from "@/generic/components/ui";
import { Sfx } from "@/yuniqa/components";
import { TypeText } from "@/generic/components/text";
import { wordEndFrame, wordFrame, type SceneProps } from "@/generic/engine";

const PHONE_WIDTH = 640;
const PROMPT = "Résume mes mails d'aujourd'hui et transforme-les en tâches";
const TASKS = ["Répondre au devis de Marc", "Payer la facture EDF avant vendredi", "Confirmer le rdv de jeudi 10h"];

// Demo 1: one sentence in the chat becomes three tasks.
export const DemoMailScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const typeStart = wordFrame(words, "resume", 14) - 6;
  const answerStart = wordEndFrame(words, "taches", 80) + 2;
  const doneStart = wordFrame(words, "fait", answerStart + 30);
  const chatWidth = PHONE_WIDTH - PHONE_WIDTH * 0.12;

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="keyboard" from={typeStart} />
      <Sfx name="pop" from={answerStart} />
      <Sfx name="success" from={doneStart} />

      <div
        style={{
          position: "absolute",
          left: (WIDTH - PHONE_WIDTH) / 2,
          top: 230,
          translate: interpolate(frame, [0, 18], ["0px 120px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          opacity: interpolate(frame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <PhoneFrame width={PHONE_WIDTH} title="Aujourd'hui">
          <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 40 }}>
            <ChatBubble role="user" from={typeStart} width={chatWidth}>
              <TypeText text={PROMPT} from={typeStart + 2} charsPerFrame={1.5} />
            </ChatBubble>
            <ChatBubble role="assistant" from={answerStart} width={chatWidth}>
              <div style={{ fontWeight: 700, fontSize: chatWidth * 0.046, marginBottom: 14 }}>
                3 tâches créées
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {TASKS.map((task, i) => (
                  <ResultRow key={task} label={task} from={answerStart + 8 + i * 7} width={chatWidth} />
                ))}
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontSize: chatWidth * 0.034,
                  color: COLORS.inkMuted,
                  opacity: interpolate(frame, [answerStart + 30, answerStart + 38], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                12 mails lus · 9 archivés
              </div>
            </ChatBubble>
          </div>
        </PhoneFrame>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 1180,
          display: "flex",
          justifyContent: "center",
          fontFamily: FONT_FAMILY,
          opacity: interpolate(frame, [doneStart, doneStart + 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [doneStart, doneStart + 12], [1.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.3, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.success,
            color: "#06200f",
            fontSize: 60,
            fontWeight: 900,
            padding: "14px 44px",
            borderRadius: 999,
            rotate: "-3deg",
            boxShadow: "0 20px 60px rgba(74,222,128,0.35)",
          }}
        >
          c'est fait ✓
        </div>
      </div>

      <Captions words={words} />
    </AbsoluteFill>
  );
};

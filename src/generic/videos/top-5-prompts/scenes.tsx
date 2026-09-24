import { AbsoluteFill } from "remotion";
import { Captions, ChatScreen, CloseUpStage, EndCard, type ChatMessage } from "@/generic/components";
import { typingFrames, type ChatDraft } from "@/generic/components/chat";
import { CLOSE_UP_SCREEN_SCALE } from "@/generic/components/device";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { Sound } from "@/generic/sounds";
import { PROMPTS, type RankedPrompt } from "./prompts";
import { RankSticker } from "./RankSticker";

const ROOM = "generic/images/desk.png";

const Chat: React.FC<{ readonly messages: ChatMessage[]; readonly draft?: ChatDraft }> = ({ messages, draft }) => (
  <ChatScreen scale={CLOSE_UP_SCREEN_SCALE} title="Claude" messages={messages} draft={draft} bottomReserve={0.22} />
);

const TYPE_FROM = 8;
const TYPING_SPEED = 1.8;

// Hook: an empty chat, then "TOP 5" slams onto the phone on "five".
export const HookScene: React.FC<SceneProps> = ({ words }) => {
  const slam = wordFrame(words, "five", 0);
  const one = wordFrame(words, "nobody", 60);
  return (
    <CloseUpStage
      words={words}
      background={ROOM}
      seed={0}
      overlay={
        <>
          <RankSticker label="TOP 5" from={slam} left={250} top={520} size={210} />
          <RankSticker label="#1 nobody uses it" from={one} left={200} top={820} size={92} rotate={5} />
        </>
      }
    >
      <Sound name="whoosh" from={0} />
      <Sound name="pop" from={slam} volume={0.2} />
      <Sound name="ping" from={one} />
      <Chat messages={[]} />
    </CloseUpStage>
  );
};

// One ranked prompt: the sticker lands, the prompt is typed in the composer with the
// keyboard running only while letters appear, sent, then the answer types in.
const promptScene = (item: RankedPrompt): React.FC<SceneProps> => {
  const PromptScene: React.FC<SceneProps> = ({ words, durationInFrames }) => {
    const typing = typingFrames(item.prompt, TYPING_SPEED);
    const sendAt = TYPE_FROM + typing + 6;
    const replyAt = Math.min(sendAt + 34, durationInFrames - 30);
    const messages: ChatMessage[] = [
      { id: "prompt", role: "user", text: item.prompt, from: sendAt },
      { id: "reply", role: "assistant", text: item.reply, from: replyAt, typingFor: 18 },
    ];
    return (
      <CloseUpStage
        words={words}
        background={ROOM}
        seed={item.rank}
        overlay={<RankSticker label={`#${item.rank}`} from={2} left={item.rank % 2 ? 90 : 760} top={170} />}
      >
        <Sound name="pop" from={2} />
        <Sound name="keyboard" from={TYPE_FROM} durationInFrames={typing} volume={0.09} />
        <Sound name="messageOut" from={sendAt} />
        <Sound name="messageIn" from={replyAt} />
        <Chat messages={messages} draft={{ text: item.prompt, from: TYPE_FROM, sendAt, charsPerFrame: TYPING_SPEED }} />
      </CloseUpStage>
    );
  };
  PromptScene.displayName = `Prompt${item.rank}Scene`;
  return PromptScene;
};

export const PROMPT_SCENES = Object.fromEntries(PROMPTS.map((item) => [item.id, promptScene(item)]));

export const EndScene: React.FC<SceneProps> = ({ words }) => (
  <AbsoluteFill>
    <Sound name="confirm" from={4} />
    <EndCard
      brand="5 prompts"
      lines={["Save this.", "Try #1", "tonight."]}
      cta="follow for part 2"
      from={2}
      ctaFrom={wordFrame(words, "try", 30)}
    />
    <Captions words={words} tone="light" />
  </AbsoluteFill>
);

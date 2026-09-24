import { AbsoluteFill } from "remotion";
import { Captions, ChatScreen, CloseUpStage, EndCard, type ChatMessage } from "@/generic/components";
import { CLOSE_UP_SCREEN_SCALE } from "@/generic/components/device";
import { wordFrame, type SceneProps } from "@/generic/engine";
import { Sound } from "@/generic/sounds";
import { PROMPTS, type RankedPrompt } from "./prompts";
import { RankSticker } from "./RankSticker";

const ROOM = "generic/images/desk.png";

const Chat: React.FC<{ readonly messages: ChatMessage[] }> = ({ messages }) => (
  <ChatScreen scale={CLOSE_UP_SCREEN_SCALE} title="Claude" messages={messages} bottomReserve={0.22} />
);

// Hook: an empty chat, then "TOP 5" slams onto the phone on "five".
export const HookScene: React.FC<SceneProps> = ({ words }) => {
  const slam = wordFrame(words, "five", 0);
  const one = wordFrame(words, "one", 60);
  return (
    <CloseUpStage
      words={words}
      background={ROOM}
      seed={0}
      overlay={
        <>
          <RankSticker label="TOP 5" from={slam} left={250} top={520} size={210} />
          <RankSticker label="#1 changes everything" from={one} left={170} top={820} size={92} rotate={5} />
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

// One ranked prompt: the sticker lands, the prompt is sent on its key word, the reply types in.
const promptScene = (item: RankedPrompt): React.FC<SceneProps> => {
  const PromptScene: React.FC<SceneProps> = ({ words, durationInFrames }) => {
    const sendAt = wordFrame(words, item.sendOn, 18);
    const replyAt = Math.min(sendAt + 46, durationInFrames - 24);
    const messages: ChatMessage[] = [
      { id: "prompt", role: "user", text: item.prompt, from: sendAt },
      { id: "reply", role: "assistant", text: item.reply, from: replyAt, typingFor: 20 },
    ];
    return (
      <CloseUpStage
        words={words}
        background={ROOM}
        seed={item.rank}
        overlay={<RankSticker label={`#${item.rank}`} from={2} left={item.rank % 2 ? 90 : 760} top={170} />}
      >
        <Sound name="pop" from={2} />
        <Sound name="keyboard" from={Math.max(0, sendAt - 20)} />
        <Sound name="messageOut" from={sendAt} />
        <Sound name="messageIn" from={replyAt} />
        <Chat messages={messages} />
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
      lines={["Save this", "for your", "next chat."]}
      cta="follow for more"
      from={2}
      ctaFrom={wordFrame(words, "follow", 36)}
    />
    <Captions words={words} tone="light" />
  </AbsoluteFill>
);

import { AbsoluteFill } from "remotion";
import { Captions, ChatScreen, CloseUpStage, EndCard, type ChatMessage } from "../../components";
import { CLOSE_UP_SCREEN_SCALE } from "../../components/device";
import { wordFrame, type SceneProps } from "../../engine";
import { Sound } from "../../sounds";

const ROOM = "generic/images/desk.png";
const TITLE = "Nimbus";

const ASK: ChatMessage = { id: "ask", role: "user", text: "Sort my inbox and turn what matters into tasks.", from: 0 };
const REPLY: ChatMessage = {
  id: "reply",
  role: "assistant",
  text: "Done. 212 read, 196 archived. 3 tasks: reply to Marc (tomorrow 10:00), pay the invoice (Friday), confirm Thursday.",
  from: 0,
};
/** A message already on screen when the scene starts. */
const shown = (message: ChatMessage): ChatMessage => ({ ...message, from: -200, typingFor: 0 });

const Chat: React.FC<{ readonly messages: ChatMessage[] }> = ({ messages }) => (
  <ChatScreen scale={CLOSE_UP_SCREEN_SCALE} title={TITLE} messages={messages} bottomReserve={0.22} />
);

// Hook: the phone settles on the desk, the thread is still empty.
export const HookScene: React.FC<SceneProps> = ({ words }) => (
  <CloseUpStage words={words} background={ROOM} seed={0}>
    <Sound name="sweep" from={0} />
    <Chat messages={[]} />
  </CloseUpStage>
);

// The request is sent on the word "sort".
export const AskScene: React.FC<SceneProps> = ({ words }) => {
  const sendAt = wordFrame(words, "sort", 20);
  return (
    <CloseUpStage words={words} background={ROOM} seed={1}>
      <Sound name="keyboard" from={Math.max(0, sendAt - 24)} />
      <Sound name="messageOut" from={sendAt} />
      <Chat messages={[{ ...ASK, from: sendAt }]} />
    </CloseUpStage>
  );
};

// The answer types in, then lands on "read".
export const AnswerScene: React.FC<SceneProps> = ({ words }) => {
  const replyAt = wordFrame(words, "read", 40);
  return (
    <CloseUpStage words={words} background={ROOM} seed={2}>
      <Sound name="messageIn" from={replyAt} />
      <Sound name="confirm" from={replyAt + 20} />
      <Chat messages={[shown(ASK), { ...REPLY, from: replyAt, typingFor: 24 }]} />
    </CloseUpStage>
  );
};

export const EndScene: React.FC<SceneProps> = ({ words }) => (
  <AbsoluteFill>
    <Sound name="confirm" from={4} />
    <EndCard
      brand={TITLE}
      lines={["One message.", "Done."]}
      cta="link in bio ↓"
      from={2}
      ctaFrom={wordFrame(words, "link", 40)}
    />
    <Captions words={words} tone="light" />
  </AbsoluteFill>
);

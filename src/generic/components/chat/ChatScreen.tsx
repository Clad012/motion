import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../engine/theme";
import type { ReactNode } from "react";
import { SCREEN_HEIGHT_BASE } from "../device/IPhone";

export type ChatMessage = {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly text: string;
  /** Local frame at which the bubble lands. */
  readonly from: number;
  /** Frames of typing indicator shown before it (assistant only). */
  readonly typingFor?: number;
};

type ChatScreenProps = {
  readonly scale: number;
  readonly title: string;
  readonly messages: ChatMessage[];
  /** Replaces the default "AI" avatar, e.g. a brand mark. */
  readonly avatar?: ReactNode;
  /** Circle behind the avatar. */
  readonly avatarBackground?: string;
  readonly accent?: string;
  /**
   * Share of the screen height kept empty above the composer, so captions drawn
   * over the lower part of the phone never cover the last bubble. 0.2 suits CloseUpStage.
   */
  readonly bottomReserve?: number;
};

const TypingDots: React.FC<{ readonly scale: number }> = ({ scale }) => {
  const { colors } = useTheme();
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        gap: 7 * scale,
        padding: `${16 * scale}px ${20 * scale}px`,
        borderRadius: 26 * scale,
        borderBottomLeftRadius: 8 * scale,
        backgroundColor: "rgba(240,239,236,0.10)",
        alignSelf: "flex-start",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 10 * scale,
            height: 10 * scale,
            borderRadius: "50%",
            backgroundColor: colors.inkMuted,
            translate: `0px ${interpolate((frame - i * 4) % 24, [0, 6, 12, 24], [0, -5 * scale, 0, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px`,
          }}
        />
      ))}
    </div>
  );
};

// A messaging thread rendered inside the phone: header, bubbles that spring in,
// a typing indicator, and the composer bar.
export const ChatScreen: React.FC<ChatScreenProps> = ({
  scale,
  title,
  messages,
  avatar,
  avatarBackground,
  accent,
  bottomReserve = 0,
}) => {
  const { colors, fonts } = useTheme();
  const frame = useCurrentFrame();
  const visible = messages.filter((m) => frame >= m.from - (m.typingFor ?? 0));
  // The thread scrolls up once it fills the screen.
  const overflow = Math.max(0, visible.length - 3) * 108 * scale;
  const scroll = interpolate(frame, [0, 1], [0, 0]) - overflow;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: fonts.sans }}>
      {/* App header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14 * scale,
          padding: `${14 * scale}px ${22 * scale}px`,
          borderBottom: "1px solid rgba(240,239,236,0.10)",
          backgroundColor: "rgba(15,15,15,0.9)",
        }}
      >
        <div
          style={{
            width: 44 * scale,
            height: 44 * scale,
            borderRadius: 999,
            backgroundColor: avatarBackground ?? "rgba(240,239,236,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {avatar ?? <div style={{ fontSize: 22 * scale, fontWeight: 800, color: colors.inkMuted }}>AI</div>}
        </div>
        <div style={{ fontSize: 24 * scale, fontWeight: 700, color: colors.ink }}>{title}</div>
      </div>

      {/* Thread */}
      <div
        style={{
          flex: 1,
          padding: `${20 * scale}px ${20 * scale}px`,
          display: "flex",
          flexDirection: "column",
          gap: 14 * scale,
          justifyContent: "flex-end",
          ...(bottomReserve > 0 ? { paddingBottom: (20 + bottomReserve * SCREEN_HEIGHT_BASE) * scale } : {}),
          translate: `0px ${Math.min(0, scroll)}px`,
        }}
      >
        {messages.map((message) => {
          const typingFor = message.typingFor ?? 0;
          const typingStart = message.from - typingFor;
          if (frame < typingStart) {
            return null;
          }
          if (typingFor > 0 && frame < message.from) {
            return <TypingDots key={`${message.id}-typing`} scale={scale} />;
          }
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "86%",
                padding: `${16 * scale}px ${20 * scale}px`,
                borderRadius: 26 * scale,
                borderBottomRightRadius: isUser ? 8 * scale : undefined,
                borderBottomLeftRadius: isUser ? undefined : 8 * scale,
                backgroundColor: isUser ? (accent ?? colors.ink) : "rgba(240,239,236,0.10)",
                color: isUser ? colors.surfaceRaised : colors.ink,
                fontSize: 25 * scale,
                fontWeight: 500,
                lineHeight: 1.32,
                opacity: interpolate(frame, [message.from, message.from + 5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                scale: interpolate(frame, [message.from, message.from + 12], [0.7, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.2, 1.5, 0.3, 1),
                  output: "perceptual-scale",
                }),
                translate: interpolate(frame, [message.from, message.from + 14], ["0px 26px", "0px 0px"], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
                transformOrigin: isUser ? "bottom right" : "bottom left",
              }}
            >
              {message.text}
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12 * scale,
          padding: `${14 * scale}px ${20 * scale}px ${30 * scale}px`,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 52 * scale,
            borderRadius: 999,
            border: "1.5px solid rgba(240,239,236,0.16)",
            display: "flex",
            alignItems: "center",
            padding: `0 ${22 * scale}px`,
            fontSize: 22 * scale,
            color: "rgba(240,239,236,0.35)",
          }}
        >
          Message
        </div>
        <div
          style={{
            width: 52 * scale,
            height: 52 * scale,
            borderRadius: 999,
            backgroundColor: accent ?? colors.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={24 * scale} height={24 * scale} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 19V5M12 5l-6 6M12 5l6 6"
              stroke={colors.surfaceRaised}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

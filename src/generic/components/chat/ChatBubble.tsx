import type { PropsWithChildren } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../engine/theme";

type ChatBubbleProps = PropsWithChildren<{
  readonly role: "user" | "assistant";
  /** Local frame when the bubble pops in. */
  readonly from: number;
  readonly width: number;
}>;

// Chat bubble in the Yuniqa style: user = off-white pill, assistant = raised dark card.
export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, from, width, children }) => {
  const { colors, fonts } = useTheme();
  const frame = useCurrentFrame();
  const isUser = role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        width: "100%",
        opacity: interpolate(frame, [from, from + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: interpolate(frame, [from, from + 14], [0.85, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 1.3, 0.3, 1),
          output: "perceptual-scale",
        }),
        translate: interpolate(frame, [from, from + 14], ["0px 24px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        transformOrigin: isUser ? "bottom right" : "bottom left",
      }}
    >
      <div
        style={{
          maxWidth: "88%",
          backgroundColor: isUser ? colors.ink : colors.surfaceRaised,
          color: isUser ? colors.surfaceRaised : colors.ink,
          borderRadius: width * 0.045,
          borderBottomRightRadius: isUser ? width * 0.012 : undefined,
          borderBottomLeftRadius: isUser ? undefined : width * 0.012,
          padding: `${width * 0.03}px ${width * 0.04}px`,
          fontFamily: fonts.sans,
          fontSize: width * 0.042,
          fontWeight: 500,
          lineHeight: 1.3,
          border: isUser ? undefined : "1.5px solid rgba(240,239,236,0.10)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

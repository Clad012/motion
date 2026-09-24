import type { PropsWithChildren } from "react";
import { useTheme } from "../../engine/theme";

type PhoneFrameProps = PropsWithChildren<{
  readonly width?: number;
  readonly title?: string;
}>;

// Simplified iPhone-style frame showing the Yuniqa dark UI.
export const PhoneFrame: React.FC<PhoneFrameProps> = ({ width = 640, title, children }) => {
  const { colors, fonts } = useTheme();
  const height = width * 2.05;
  const radius = width * 0.135;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#151514",
        padding: width * 0.02,
        boxShadow: "0 60px 120px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(240,239,236,0.10)",
        fontFamily: fonts.sans,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius - width * 0.02,
          backgroundColor: colors.surface,
          overflow: "hidden",
          position: "relative",
          color: colors.ink,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: width * 0.03,
            left: "50%",
            translate: "-50% 0",
            width: width * 0.3,
            height: width * 0.085,
            borderRadius: 999,
            backgroundColor: "#000",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: width * 0.04,
            left: width * 0.08,
            fontSize: width * 0.045,
            fontWeight: 600,
          }}
        >
          9:41
        </div>
        {title ? (
          <div
            style={{
              position: "absolute",
              top: width * 0.17,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: width * 0.05,
              fontWeight: 600,
              color: colors.inkMuted,
            }}
          >
            {title}
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            top: width * 0.27,
            left: width * 0.06,
            right: width * 0.06,
            bottom: width * 0.08,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

import { useTheme } from "../../engine/theme";
import { Glyph, type GlyphName } from "../icons/Glyph";

type AppTileProps = {
  readonly label: string;
  readonly glyph: GlyphName;
  readonly size?: number;
  readonly price?: string;
  readonly tone?: "dark" | "light";
};

// An "app" card, used to represent the stack of subscriptions in the hook.
export const AppTile: React.FC<AppTileProps> = ({ label, glyph, size = 200, price, tone = "dark" }) => {
  const { colors, fonts } = useTheme();
  const isDark = tone === "dark";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        backgroundColor: isDark ? colors.surfaceRaised : "#ffffff",
        border: `2px solid ${isDark ? "rgba(240,239,236,0.12)" : "rgba(28,28,26,0.08)"}`,
        boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: size * 0.07,
        fontFamily: fonts.sans,
        color: isDark ? colors.ink : colors.surfaceRaised,
        position: "relative",
      }}
    >
      <Glyph name={glyph} size={size * 0.38} color={isDark ? colors.ink : colors.surfaceRaised} />
      <div style={{ fontSize: size * 0.15, fontWeight: 600, letterSpacing: -0.5 }}>{label}</div>
      {price ? (
        <div
          style={{
            position: "absolute",
            top: -size * 0.09,
            right: -size * 0.09,
            backgroundColor: colors.error,
            color: "#160606",
            fontWeight: 800,
            fontSize: size * 0.13,
            padding: `${size * 0.04}px ${size * 0.09}px`,
            borderRadius: 999,
            boxShadow: "0 10px 24px rgba(0,0,0,0.4)",
          }}
        >
          {price}
        </div>
      ) : null}
    </div>
  );
};

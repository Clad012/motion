import { createContext, useContext, type PropsWithChildren } from "react";
import { GEIST, GEIST_MONO, loadGeistFonts } from "./fonts";

/**
 * Everything a brand changes about the shared components. A brand exports one of
 * these (see src/yuniqa/theme.ts); generic components read it with useTheme().
 */
export type ThemeColors = {
  /** Frame background. */
  readonly bg: string;
  /** App screens inside a device. */
  readonly surface: string;
  /** Cards, bubbles and tiles on top of a surface. */
  readonly surfaceRaised: string;
  /** Main text and icons. */
  readonly ink: string;
  readonly inkMuted: string;
  readonly inkFaint: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly info: string;
};

export type Theme = {
  readonly name: string;
  readonly colors: ThemeColors;
  readonly fonts: { readonly sans: string; readonly mono: string };
  /** Colour of the word being spoken in captions. Defaults to colors.warning. */
  readonly captionHighlight?: string;
  /** Default music bed for VideoShell, relative to public/. */
  readonly music?: { readonly file: string; readonly volume: number };
  /** Called before rendering; load web fonts here. Must be idempotent. */
  readonly loadFonts?: () => unknown;
};

/** Dark, brand-free theme used by the generic templates and as the fallback. */
export const neutralTheme: Theme = {
  name: "neutral",
  colors: {
    bg: "#0b0b0c",
    surface: "#111113",
    surfaceRaised: "#1d1d20",
    ink: "#f4f4f5",
    inkMuted: "rgba(244, 244, 245, 0.62)",
    inkFaint: "rgba(244, 244, 245, 0.14)",
    success: "#34d399",
    warning: "#facc15",
    error: "#f87171",
    info: "#60a5fa",
  },
  fonts: { sans: GEIST, mono: GEIST_MONO },
  loadFonts: loadGeistFonts,
};

const ThemeContext = createContext<Theme>(neutralTheme);

export const ThemeProvider: React.FC<PropsWithChildren<{ readonly theme: Theme }>> = ({ theme, children }) => {
  theme.loadFonts?.();
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => useContext(ThemeContext);

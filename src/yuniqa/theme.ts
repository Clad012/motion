import type { Theme } from "@/generic/engine/theme";
import { COLORS, FONT_FAMILY, MONO_FAMILY, MUSIC_FILE, MUSIC_VOLUME } from "./brand";
import { ensureFonts } from "./fonts";

// What the generic components need to look like Yuniqa: monochrome, Geist, the default beat.
export const yuniqaTheme: Theme = {
  name: "yuniqa",
  colors: COLORS,
  fonts: { sans: FONT_FAMILY, mono: MONO_FAMILY },
  captionHighlight: COLORS.warning,
  music: { file: MUSIC_FILE, volume: MUSIC_VOLUME },
  loadFonts: ensureFonts,
};

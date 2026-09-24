import { loadGeistFonts } from "@/generic/engine/fonts";

// Geist is the Yuniqa brand font (same files as every other Geist theme, in public/fonts/geist).
// Videos that do not go through the theme (the hand-made film cuts) call this directly.
export const ensureFonts = loadGeistFonts;

ensureFonts();

export { FONT_FAMILY, MONO_FAMILY } from "./brand";

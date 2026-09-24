import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Geist and Geist Mono (SIL Open Font License, see public/fonts/geist/OFL.txt).
// Shared by every theme that uses them; loading is cached, so calling it twice is free.
export const GEIST = "Geist";
export const GEIST_MONO = "Geist Mono";

const SANS_WEIGHTS: Array<[string, string]> = [
  ["400", "Geist-Regular.woff2"],
  ["500", "Geist-Medium.woff2"],
  ["600", "Geist-SemiBold.woff2"],
  ["700", "Geist-Bold.woff2"],
  ["900", "Geist-Black.woff2"],
];

const MONO_WEIGHTS: Array<[string, string]> = [
  ["400", "GeistMono-Regular.woff2"],
  ["500", "GeistMono-Medium.woff2"],
  ["700", "GeistMono-Bold.woff2"],
];

let loaded: Promise<void[]> | null = null;

export const loadGeistFonts = (): Promise<void[]> => {
  if (!loaded) {
    const load =
      (family: string) =>
      ([weight, file]: [string, string]) =>
        loadFont({ family, url: staticFile(`fonts/geist/${file}`), weight, format: "woff2" });
    loaded = Promise.all([...SANS_WEIGHTS.map(load(GEIST)), ...MONO_WEIGHTS.map(load(GEIST_MONO))]);
  }
  return loaded;
};

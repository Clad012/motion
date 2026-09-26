// Finds every video folder, src/<project>/videos/<id>/, with what scripts need to know about it.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { ScriptLine, VoiceoverManifest } from "../../src/generic/engine/voiceover.ts";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Templates copied by `pnpm new-video`; the starter is silent on purpose. */
export const TEMPLATES = new Set(["generic/starter", "generic/phone-demo", "generic/split-compare"]);

export type VideoFolder = {
  project: string;
  /** Folder name, what `pnpm voiceover --video=` takes. */
  id: string;
  dir: string;
  /** Composition id from video.tsx (PascalCase), what `pnpm render` takes. */
  compositionId: string | null;
  hasScript: boolean;
};

export const listVideos = (): VideoFolder[] => {
  const videos: VideoFolder[] = [];
  for (const project of readdirSync(join(ROOT, "src"), { withFileTypes: true })) {
    const base = join(ROOT, "src", project.name, "videos");
    if (!project.isDirectory() || !existsSync(base)) continue;
    for (const folder of readdirSync(base, { withFileTypes: true })) {
      if (!folder.isDirectory()) continue;
      const dir = join(base, folder.name);
      const videoFile = join(dir, "video.tsx");
      const source = existsSync(videoFile) ? readFileSync(videoFile, "utf8") : "";
      videos.push({
        project: project.name,
        id: folder.name,
        dir,
        compositionId: /\bid: "([A-Za-z0-9]+)",/.exec(source)?.[1] ?? null,
        hasScript: existsSync(join(dir, "script.ts")),
      });
    }
  }
  return videos;
};

const squash = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * The folder of a composition. Videos made with `pnpm new-video` name it in
 * video.tsx; older ones are registered by hand, under their folder name in
 * PascalCase (retour → Retour, duel-ia → DuelIA).
 */
export const findVideo = (compositionId: string): VideoFolder | undefined => {
  const videos = listVideos();
  return (
    videos.find((v) => v.compositionId === compositionId) ??
    videos.find((v) => v.compositionId === null && squash(v.id) === squash(compositionId))
  );
};

export const readScript = async (video: VideoFolder): Promise<readonly ScriptLine[]> => {
  const mod = (await import(pathToFileURL(join(video.dir, "script.ts")).href)) as { SCRIPT: readonly ScriptLine[] };
  return mod.SCRIPT;
};

export const readManifest = (video: VideoFolder): VoiceoverManifest | null => {
  const path = join(video.dir, "generated", "voiceover.json");
  return existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as VoiceoverManifest) : null;
};

export type VoiceState =
  | { kind: "voiced" }
  | { kind: "silent" }
  | { kind: "mismatch"; script: string[]; voiceover: string[] }
  | { kind: "missing-audio"; files: string[] };

/** Whether the video will play with its voice, and if not, why. */
export const voiceState = async (video: VideoFolder): Promise<VoiceState> => {
  const script = (await readScript(video)).map((line) => line.id);
  const manifest = readManifest(video);
  if (!manifest || manifest.scenes.length === 0) return { kind: "silent" };
  const voiceover = manifest.scenes.map((scene) => scene.id);
  if (voiceover.join(",") !== script.join(",")) return { kind: "mismatch", script, voiceover };
  const files = manifest.scenes
    .map((scene) => join("public", scene.file))
    .filter((file) => !existsSync(join(ROOT, file)));
  return files.length > 0 ? { kind: "missing-audio", files } : { kind: "voiced" };
};

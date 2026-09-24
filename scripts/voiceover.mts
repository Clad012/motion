// Generates the voiceover of one video with ElevenLabs, with word-level timestamps.
//
//   pnpm voiceover --video=<id>            every scene of src/<project>/videos/<id>/script.ts
//   pnpm voiceover --video=<id> --only=hook,cta
//   pnpm voiceover --video=<id> --model=eleven_v3
//   pnpm voiceover --list                  videos that have a script
//
// The script module exports SCRIPT (ScriptLine[]) and VOICE_ID; it may also export
// MODEL_ID, VOICE_SETTINGS and LANGUAGE_CODE (ISO 639-1, sent to models that accept
// it — every one except eleven_multilingual_v2). Output:
//   public/<project>/voiceover/<id>/<scene>.mp3
//   src/<project>/videos/<id>/generated/voiceover.json   (read by defineVideo)

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { ScriptLine, VoiceoverManifest, VoiceoverScene, VoiceoverWord } from "../src/generic/engine/voiceover.ts";

// eleven_multilingual_v2 keeps the delivery tight; eleven_v3 is more expressive but
// reads ~40% slower and rejects request stitching (previous_text / next_text).
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";
const FALLBACK_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.45,
  similarity_boost: 0.8,
  style: 0.35,
  use_speaker_boost: true,
  speed: 1.05,
};

type ScriptModule = {
  SCRIPT: readonly ScriptLine[];
  VOICE_ID: string;
  MODEL_ID?: string;
  VOICE_SETTINGS?: Record<string, unknown>;
  LANGUAGE_CODE?: string;
};

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const arg = (name: string): string | null => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : null;
};

/** Every src/<project>/videos/<id>/script.ts, keyed by id. */
const discover = (): Map<string, Array<{ project: string; dir: string }>> => {
  const found = new Map<string, Array<{ project: string; dir: string }>>();
  for (const project of readdirSync(join(ROOT, "src"), { withFileTypes: true })) {
    const videos = join(ROOT, "src", project.name, "videos");
    if (!project.isDirectory() || !existsSync(videos)) continue;
    for (const video of readdirSync(videos, { withFileTypes: true })) {
      if (video.isDirectory() && existsSync(join(videos, video.name, "script.ts"))) {
        const list = found.get(video.name) ?? [];
        list.push({ project: project.name, dir: join(videos, video.name) });
        found.set(video.name, list);
      }
    }
  }
  return found;
};

const videos = discover();

if (process.argv.includes("--list")) {
  for (const [id, places] of [...videos].sort()) {
    console.log(`${id.padEnd(22)} ${places.map((p) => relative(ROOT, p.dir)).join(", ")}`);
  }
  process.exit(0);
}

const videoId = arg("video");
const places = videoId ? videos.get(videoId) : undefined;
if (!videoId || !places) {
  console.error(`Pass --video=<id>. Videos with a script: ${[...videos.keys()].sort().join(", ")}`);
  process.exit(1);
}
const projectArg = arg("project");
const place = projectArg ? places.find((p) => p.project === projectArg) : places.length === 1 ? places[0] : undefined;
if (!place) {
  console.error(`"${videoId}" exists in several projects; pass --project=${places.map((p) => p.project).join("|")}`);
  process.exit(1);
}

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("ELEVENLABS_API_KEY is missing. Copy .env.example to .env.local and fill it in.");
  process.exit(1);
}

const mod = (await import(pathToFileURL(join(place.dir, "script.ts")).href)) as ScriptModule;
if (!Array.isArray(mod.SCRIPT) || typeof mod.VOICE_ID !== "string") {
  console.error(`${relative(ROOT, place.dir)}/script.ts must export SCRIPT and VOICE_ID.`);
  process.exit(1);
}
const script = mod.SCRIPT;
const voiceId = mod.VOICE_ID;
const voiceSettings = { ...DEFAULT_VOICE_SETTINGS, ...(mod.VOICE_SETTINGS ?? {}) };
const requestedModelId = arg("model") ?? mod.MODEL_ID ?? DEFAULT_MODEL_ID;
const onlyArg = arg("only");
const only = onlyArg ? new Set(onlyArg.split(",")) : null;

const publicFolder = `${place.project}/voiceover/${videoId}`;
const audioDir = join(ROOT, "public", publicFolder);
const manifestPath = join(place.dir, "generated", "voiceover.json");

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

type TtsResponse = {
  audio_base64: string;
  alignment: Alignment | null;
  normalized_alignment: Alignment | null;
};

const wordsFromAlignment = (alignment: Alignment): VoiceoverWord[] => {
  const words: VoiceoverWord[] = [];
  let current = "";
  let start = 0;
  let end = 0;

  const flush = () => {
    if (current.trim().length > 0) {
      words.push({ text: current, startMs: Math.round(start * 1000), endMs: Math.round(end * 1000) });
    }
    current = "";
  };

  alignment.characters.forEach((char, i) => {
    const charStart = alignment.character_start_times_seconds[i];
    const charEnd = alignment.character_end_times_seconds[i];
    if (char === " " || char === "\n") {
      flush();
      return;
    }
    if (current.length === 0) {
      start = charStart;
    }
    current += char;
    end = charEnd;
  });
  flush();
  return words;
};

const requestTts = async (
  text: string,
  modelId: string,
  previousText: string | undefined,
  nextText: string | undefined,
): Promise<Response> => {
  const supportsStitching = modelId !== "eleven_v3";
  const body: Record<string, unknown> = {
    text,
    model_id: modelId,
    previous_text: supportsStitching ? previousText : undefined,
    next_text: supportsStitching ? nextText : undefined,
    voice_settings: voiceSettings,
  };
  if (mod.LANGUAGE_CODE && modelId !== "eleven_multilingual_v2") {
    body.language_code = mod.LANGUAGE_CODE;
  }
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

const generateScene = async (index: number): Promise<VoiceoverScene> => {
  const scene = script[index];
  const previousText = script[index - 1]?.voice;
  const nextText = script[index + 1]?.voice;

  let modelId = requestedModelId;
  let response = await requestTts(scene.voice, modelId, previousText, nextText);
  if (!response.ok && response.status >= 400 && response.status < 500 && modelId !== FALLBACK_MODEL_ID) {
    console.warn(`  ${modelId} rejected (${response.status}); retrying with ${FALLBACK_MODEL_ID}`);
    modelId = FALLBACK_MODEL_ID;
    response = await requestTts(scene.voice, modelId, previousText, nextText);
  }
  if (!response.ok) {
    throw new Error(`ElevenLabs ${response.status}: ${await response.text()}`);
  }

  const json = (await response.json()) as TtsResponse;
  const alignment = json.alignment ?? json.normalized_alignment;
  if (!alignment) {
    throw new Error(`No alignment returned for scene ${scene.id}`);
  }

  writeFileSync(join(audioDir, `${scene.id}.mp3`), Buffer.from(json.audio_base64, "base64"));

  const words = wordsFromAlignment(alignment);
  const durationMs = Math.round((alignment.character_end_times_seconds.at(-1) ?? 0) * 1000);

  console.log(`  ${scene.id}: ${(durationMs / 1000).toFixed(2)}s, ${words.length} words (${modelId})`);
  return {
    id: scene.id,
    file: `${publicFolder}/${scene.id}.mp3`,
    durationMs,
    tailMs: scene.tailMs ?? 300,
    modelId,
    words,
  };
};

const loadExistingManifest = (): VoiceoverManifest | null => {
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8")) as VoiceoverManifest;
  } catch {
    return null;
  }
};

mkdirSync(audioDir, { recursive: true });
mkdirSync(dirname(manifestPath), { recursive: true });
const existing = loadExistingManifest();

console.log(`[${place.project}/${videoId}] ${script.length} scenes, voice ${voiceId}`);
const scenes: VoiceoverScene[] = [];
for (let i = 0; i < script.length; i++) {
  const scene = script[i];
  const cached = existing?.scenes.find((s) => s.id === scene.id);
  if (only && !only.has(scene.id) && cached) {
    console.log(`  ${scene.id}: kept from previous manifest`);
    scenes.push({ ...cached, tailMs: scene.tailMs ?? 300 });
    continue;
  }
  scenes.push(await generateScene(i));
}

const manifest: VoiceoverManifest = { voiceId, generatedAt: new Date().toISOString(), scenes };
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const total = scenes.reduce((sum, s) => sum + s.durationMs + s.tailMs, 0);
console.log(`Done. ≈ ${(total / 1000).toFixed(1)}s → ${relative(ROOT, manifestPath)}`);

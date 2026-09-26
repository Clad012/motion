// Generates the voiceover of one video with ElevenLabs, with word-level timestamps.
//
//   pnpm voiceover --video=<id>            every scene of src/<project>/videos/<id>/script.ts
//   pnpm voiceover --video=<id> --only=hook,cta
//   pnpm voiceover --video=<id> --model=eleven_v3
//   pnpm voiceover --list                  videos that have a script
//
// Without an ElevenLabs key (the audio was made elsewhere, e.g. through another tool):
//   pnpm voiceover --video=<id> --from-files           one MP3 per scene, already in
//                                                      public/<project>/voiceover/<id>/<scene>.mp3
//   pnpm voiceover --video=<id> --from-file=take.mp3   one MP3 for the whole script, cut per scene
// Word timings then come from faster-whisper (--whisper-model=small by default); with
// --from-files and no faster-whisper, they are estimated from the text.
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
import { alignWords, scriptWords, spreadWords, type HeardWord } from "./lib/align.mts";
import { audioDurationMs, cutAudio, silences, speechEndMs, transcribe, whisperAvailable } from "./lib/audio.mts";

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

const fromFiles = process.argv.includes("--from-files");
const fromFile = arg("from-file");
const external = fromFiles || fromFile !== null;

const apiKey = process.env.ELEVENLABS_API_KEY ?? "";
if (!external && !apiKey) {
  console.error(
    "ELEVENLABS_API_KEY is missing. Copy .env.example to .env.local and fill it in, or bring your own audio:\n" +
      "  --from-files (one MP3 per scene) or --from-file=<narration.mp3>.",
  );
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

// ---- Audio made elsewhere: time the script's words on it ----

const whisperModel = arg("whisper-model") ?? "small";
const externalModelId = arg("model") ?? "external";
const fullText = script.map((line) => line.voice).join(" ");

const sceneFrom = (line: ScriptLine, words: VoiceoverWord[], durationMs: number): VoiceoverScene => {
  console.log(`  ${line.id}: ${(durationMs / 1000).toFixed(2)}s, ${words.length} words`);
  return {
    id: line.id,
    file: `${publicFolder}/${line.id}.mp3`,
    durationMs,
    tailMs: line.tailMs ?? 300,
    modelId: externalModelId,
    words,
  };
};

/** --from-files: one MP3 per scene, already in public/. */
const scenesFromFiles = (): VoiceoverScene[] => {
  const cachedOf = (line: ScriptLine) => existing?.scenes.find((s) => s.id === line.id);
  const todo = script.filter((line) => !(only && !only.has(line.id) && cachedOf(line)));
  const pathOf = (line: ScriptLine) => join(audioDir, `${line.id}.mp3`);
  const missing = todo.filter((line) => !existsSync(pathOf(line)));
  if (missing.length > 0) {
    console.error(
      `Missing audio. Put one MP3 per scene here:\n${missing.map((l) => `  ${relative(ROOT, pathOf(l))}`).join("\n")}`,
    );
    process.exit(1);
  }
  let heard = new Map<string, HeardWord[]>();
  if (whisperAvailable()) {
    console.log(`  timing words with faster-whisper (${whisperModel})…`);
    heard = transcribe(todo.map(pathOf), { model: whisperModel, language: mod.LANGUAGE_CODE, prompt: fullText });
  } else {
    console.warn("  faster-whisper not found: word timings are estimated from the text (captions may drift).");
  }
  return script.map((line) => {
    const cached = cachedOf(line);
    if (!todo.includes(line) && cached) {
      console.log(`  ${line.id}: kept from previous manifest`);
      return { ...cached, tailMs: line.tailMs ?? 300 };
    }
    // Up to where the sound stops, measured on the audio: faster-whisper ends words
    // early (up to ~0.8 s), which would clip the last syllable.
    const spokenMs = speechEndMs(pathOf(line));
    const tokens = scriptWords(line.voice);
    const got = heard.get(pathOf(line)) ?? [];
    return sceneFrom(line, got.length > 0 ? alignWords(tokens, got) : spreadWords(tokens, spokenMs), spokenMs);
  });
};

/** --from-file: one narration for the whole script, cut between scenes. */
const scenesFromOneFile = (source: string): VoiceoverScene[] => {
  if (only) {
    console.error("--only works with --from-files. With --from-file, every scene is cut from the one take.");
    process.exit(1);
  }
  if (!existsSync(source)) {
    console.error(`No such file: ${source}`);
    process.exit(1);
  }
  if (!whisperAvailable()) {
    console.error("--from-file needs faster-whisper to find where each scene starts (pip install faster-whisper).");
    process.exit(1);
  }
  console.log(`  timing words with faster-whisper (${whisperModel})…`);
  const heard =
    transcribe([source], { model: whisperModel, language: mod.LANGUAGE_CODE, prompt: fullText }).get(source) ?? [];
  const tokens = script.map((line) => scriptWords(line.voice));
  const all = alignWords(tokens.flat(), heard);
  const perScene: VoiceoverWord[][] = [];
  let at = 0;
  for (const list of tokens) {
    perScene.push(all.slice(at, at + list.length));
    at += list.length;
  }
  const lengthMs = audioDurationMs(source);
  const pauses = silences(source);
  // A scene starts in the middle of the real pause before its first word. The
  // pause is found on the audio: faster-whisper's word ends run early (up to
  // ~0.8 s), so cutting between its timings could clip the previous line.
  const starts = perScene.map((words, i) => {
    if (i === 0) return 0;
    const firstStart = words[0]?.startMs ?? 0;
    const previousStart = perScene[i - 1][0]?.startMs ?? 0;
    const pause = pauses
      .filter((p) => p.startMs > previousStart && p.startMs < firstStart + 100)
      .sort((x, y) => Math.abs(x.endMs - firstStart) - Math.abs(y.endMs - firstStart))[0];
    if (pause) return Math.round((pause.startMs + Math.min(pause.endMs, firstStart)) / 2);
    const previousEnd = perScene[i - 1].at(-1)?.endMs ?? 0;
    console.warn(`  ${script[i].id}: no pause found before it; cutting between the words`);
    return Math.max(previousEnd, Math.round((previousEnd + firstStart) / 2));
  });
  return script.map((line, i) => {
    const start = starts[i];
    const end = starts[i + 1] ?? lengthMs;
    const target = join(audioDir, `${line.id}.mp3`);
    cutAudio(source, target, start, end);
    const words = perScene[i].map((w) => ({ ...w, startMs: w.startMs - start, endMs: w.endMs - start }));
    // The pause after the line is not part of it: the scene's own tailMs sets it.
    return sceneFrom(line, words, speechEndMs(target));
  });
};

console.log(`[${place.project}/${videoId}] ${script.length} scenes, voice ${voiceId}`);
const scenes: VoiceoverScene[] = [];
if (fromFile !== null) {
  scenes.push(...scenesFromOneFile(resolve(fromFile)));
} else if (fromFiles) {
  scenes.push(...scenesFromFiles());
} else {
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
}

const manifest: VoiceoverManifest = { voiceId, generatedAt: new Date().toISOString(), scenes };
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const total = scenes.reduce((sum, s) => sum + s.durationMs + s.tailMs, 0);
console.log(`Done. ≈ ${(total / 1000).toFixed(1)}s → ${relative(ROOT, manifestPath)}`);

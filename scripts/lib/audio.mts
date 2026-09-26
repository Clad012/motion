// Audio helpers for scripts: length, cutting, and word timings from speech.
//
// ffmpeg / ffprobe: the system ones when installed, otherwise the copies that ship
// with Remotion (`remotion ffmpeg`), so nothing extra is needed to run them.
// Word timings: faster-whisper (Python), when it is installed.

import { spawnSync } from "node:child_process";
import type { HeardWord } from "./align.mts";

/** Runs ffmpeg or ffprobe (system copy first, Remotion's otherwise) and returns its output. */
const run = (tool: "ffmpeg" | "ffprobe", args: string[]): { stdout: string; stderr: string } => {
  let result = spawnSync(tool, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if ((result.error as NodeJS.ErrnoException | undefined)?.code === "ENOENT") {
    result = spawnSync("pnpm", ["exec", "remotion", tool, ...args], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  }
  if (result.status !== 0) {
    throw new Error(`${tool} failed (exit ${result.status}): ${result.stderr?.slice(-500)}`);
  }
  return { stdout: result.stdout, stderr: result.stderr };
};

export const audioDurationMs = (file: string): number => {
  const { stdout } = run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  const seconds = Number.parseFloat(stdout.trim());
  if (!Number.isFinite(seconds)) throw new Error(`Could not read the length of ${file}`);
  return Math.round(seconds * 1000);
};

export type Silence = { startMs: number; endMs: number };

/** Every pause of at least 150 ms (below -45 dB), in order. The last one may run to the end. */
export const silences = (file: string): Silence[] => {
  const lengthMs = audioDurationMs(file);
  // silencedetect reports on stderr; the null muxer writes nothing.
  const { stderr } = run("ffmpeg", [
    "-hide_banner",
    "-i",
    file,
    "-af",
    "silencedetect=noise=-45dB:d=0.15",
    "-f",
    "null",
    "-",
  ]);
  const starts = [...stderr.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) =>
    Math.max(0, Math.round(Number(m[1]) * 1000)),
  );
  const ends = [...stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Math.round(Number(m[1]) * 1000));
  return starts.map((startMs, i) => ({ startMs, endMs: ends[i] ?? lengthMs }));
};

/**
 * Where the speech ends: the start of the silence that runs to the end of the
 * file, or the file's length when it ends on sound. A scene then lasts as long as
 * the words plus its own `tailMs`, as with ElevenLabs' alignment.
 */
export const speechEndMs = (file: string): number => {
  const lengthMs = audioDurationMs(file);
  const last = silences(file).at(-1);
  return last && last.startMs > 0 && last.endMs >= lengthMs - 50 ? Math.min(lengthMs, last.startMs + 60) : lengthMs;
};

/** Copies [startMs, endMs) of `source` into `target` as a 128 kb/s MP3. */
export const cutAudio = (source: string, target: string, startMs: number, endMs: number): void => {
  run("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-i",
    source,
    "-ss",
    (startMs / 1000).toFixed(3),
    "-to",
    (endMs / 1000).toFixed(3),
    "-c:a",
    "libmp3lame",
    "-b:a",
    "128k",
    target,
  ]);
};

const PYTHON = ["python3", "python"];

const TRANSCRIBE = `
import json, sys
from faster_whisper import WhisperModel
model_name, language, prompt, *files = sys.argv[1:]
model = WhisperModel(model_name, device="cpu", compute_type="int8")
out = {}
for path in files:
    segments, _ = model.transcribe(
        path,
        language=language or None,
        initial_prompt=prompt or None,
        word_timestamps=True,
        beam_size=5,
    )
    out[path] = [
        {"text": w.word.strip(), "startMs": round(w.start * 1000), "endMs": round(w.end * 1000)}
        for s in segments
        for w in (s.words or [])
    ]
print(json.dumps(out))
`;

const findPython = (): string | null => {
  for (const python of PYTHON) {
    const probe = spawnSync(python, ["-c", "import faster_whisper"], { stdio: "ignore" });
    if (probe.status === 0) return python;
  }
  return null;
};

export const whisperAvailable = (): boolean => findPython() !== null;

/**
 * Word timings for each file, heard by faster-whisper. One model load for all
 * files. `language` is an ISO 639-1 code (recommended: English-only models and
 * auto-detection can translate or mishear); `prompt` is the expected text, which
 * helps with names and jargon.
 */
export const transcribe = (
  files: readonly string[],
  options: { model: string; language?: string; prompt?: string },
): Map<string, HeardWord[]> => {
  const python = findPython();
  if (!python) throw new Error("faster-whisper is not installed (pip install faster-whisper).");
  const result = spawnSync(
    python,
    ["-c", TRANSCRIBE, options.model, options.language ?? "", options.prompt ?? "", ...files],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "inherit"] },
  );
  if (result.status !== 0) throw new Error(`faster-whisper failed (exit ${result.status}).`);
  const parsed = JSON.parse(result.stdout.trim().split("\n").at(-1) ?? "{}") as Record<string, HeardWord[]>;
  return new Map(files.map((file) => [file, parsed[file] ?? []]));
};

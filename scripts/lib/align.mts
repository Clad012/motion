// Puts the script's exact words on the timings a speech recogniser heard.
//
// The recogniser (faster-whisper) gives good timings but its own spelling: "3000"
// for "3 000", a misheard name, a dropped "de". Captions must show the script, so
// the two word lists are aligned (edit distance) and each script word takes the
// timing of the heard word it lines up with. Script words with no counterpart are
// placed between their timed neighbours.

import type { VoiceoverWord } from "../../src/generic/engine/voiceover.ts";

export type HeardWord = { text: string; startMs: number; endMs: number };

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9']/g, "");

export const scriptWords = (text: string): string[] => text.split(/\s+/).filter((word) => word.length > 0);

// Two words count as the same when one normalised form is a prefix of the other
// ("l'appli" / "lappli", "ok" / "okay"), so small recogniser variants still match.
const same = (a: string, b: string): boolean => a.length > 0 && b.length > 0 && (a.startsWith(b) || b.startsWith(a));

const editDistance = (a: string, b: string): number => {
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current.push(Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
    }
    previous = current;
  }
  return previous[b.length];
};

// Pairing two different words costs 0.5 to 1: the closer the spelling ("unica" for
// "Yuniqa"), the cheaper, so a misheard word pairs with the word it was meant to be.
const pairCost = (a: string, b: string): number => {
  if (same(a, b)) return 0;
  const longest = Math.max(a.length, b.length) || 1;
  return 1 - 0.5 * (1 - editDistance(a, b) / longest);
};

/**
 * Timings for each script word, in order. `heard` is what the recogniser returned
 * for the same audio. Returns one entry per script word.
 */
export const alignWords = (script: readonly string[], heard: readonly HeardWord[]): VoiceoverWord[] => {
  const s = script.map(normalize);
  const h = heard.map((word) => normalize(word.text));
  const rows = s.length + 1;
  const cols = h.length + 1;

  // cost[i][j]: cheapest alignment of the first i script words with the first j heard words.
  const cost: number[][] = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      cost[i][j] = Math.min(cost[i - 1][j - 1] + pairCost(s[i - 1], h[j - 1]), cost[i - 1][j] + 1, cost[i][j - 1] + 1);
    }
  }

  // Walk back: a pair (match or substitution) gives the script word a timing.
  const timing: Array<{ startMs: number; endMs: number } | null> = new Array(script.length).fill(null);
  let i = s.length;
  let j = h.length;
  while (i > 0 && j > 0) {
    const pair = cost[i - 1][j - 1] + pairCost(s[i - 1], h[j - 1]);
    if (Math.abs(cost[i][j] - pair) < 1e-9) {
      timing[i - 1] = { startMs: heard[j - 1].startMs, endMs: heard[j - 1].endMs };
      i -= 1;
      j -= 1;
    } else if (Math.abs(cost[i][j] - (cost[i - 1][j] + 1)) < 1e-9) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  // Untimed script words share the gap between their timed neighbours.
  const lastEnd = heard.at(-1)?.endMs ?? 0;
  const words: VoiceoverWord[] = [];
  let k = 0;
  while (k < script.length) {
    const known = timing[k];
    if (known) {
      words.push({ text: script[k], startMs: known.startMs, endMs: known.endMs });
      k += 1;
      continue;
    }
    let end = k;
    while (end < script.length && !timing[end]) end += 1;
    const from = words.at(-1)?.endMs ?? 0;
    const to = timing[end]?.startMs ?? Math.max(from, lastEnd);
    const step = (to - from) / (end - k);
    for (let n = 0; n < end - k; n++) {
      const startMs = Math.round(from + step * n);
      words.push({ text: script[k + n], startMs, endMs: Math.round(startMs + step * 0.9) });
    }
    k = end;
  }
  return words;
};

/**
 * Timings for a line when no recogniser is available: the words are spread over
 * the audio by length, like a silent video's captions.
 */
export const spreadWords = (script: readonly string[], durationMs: number): VoiceoverWord[] => {
  const letters = script.reduce((sum, word) => sum + word.length + 2, 0) || 1;
  let at = 0;
  return script.map((text) => {
    const length = ((text.length + 2) / letters) * durationMs;
    const word = { text, startMs: Math.round(at), endMs: Math.round(at + length * 0.9) };
    at += length;
    return word;
  });
};

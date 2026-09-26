import assert from "node:assert/strict";
import { test } from "node:test";
import { alignWords, scriptWords, spreadWords } from "./align.mts";

const heard = (...words: Array<[string, number, number]>) =>
  words.map(([text, startMs, endMs]) => ({ text, startMs, endMs }));

test("script words take the timings of the words heard, with the script's spelling", () => {
  const words = alignWords(
    scriptWords("Tu reviens, et c'est la panique."),
    heard(
      ["tu", 0, 200],
      ["reviens", 200, 600],
      ["et", 650, 700],
      ["c'est", 700, 900],
      ["la", 900, 1000],
      ["panique", 1000, 1500],
    ),
  );
  assert.deepEqual(
    words.map((w) => [w.text, w.startMs]),
    [
      ["Tu", 0],
      ["reviens,", 200],
      ["et", 650],
      ["c'est", 700],
      ["la", 900],
      ["panique.", 1000],
    ],
  );
});

test("a misheard word keeps its slot, a dropped word is placed between its neighbours", () => {
  const words = alignWords(
    scriptWords("Yuniqa trie tes mails"),
    heard(["unica", 0, 400], ["tes", 700, 900], ["mails", 900, 1300]),
  );
  assert.equal(words.length, 4);
  assert.equal(words[0].startMs, 0); // "Yuniqa" ← "unica"
  assert.ok(words[1].startMs >= 400 && words[1].startMs < 700); // "trie" was not heard
  assert.equal(words[2].startMs, 700);
});

test("numbers split differently still line up", () => {
  const words = alignWords(
    scriptWords("3 000 mails lus"),
    heard(["3000", 0, 500], ["mails", 500, 900], ["lus", 900, 1200]),
  );
  assert.deepEqual(
    words.map((w) => w.text),
    ["3", "000", "mails", "lus"],
  );
  assert.equal(words[2].startMs, 500);
  assert.equal(words[3].startMs, 900);
});

test("spreadWords covers the line in order", () => {
  const words = spreadWords(scriptWords("un deux trois"), 1500);
  assert.equal(words.length, 3);
  assert.ok(words.every((w, i) => i === 0 || w.startMs > words[i - 1].startMs));
  assert.ok((words.at(-1)?.endMs ?? 0) <= 1500);
});

// Generates a set of sound effects with ElevenLabs Sound Effects.
//
//   pnpm sfx --bank=src/yuniqa/soundbank.ts --set=v3
//   pnpm sfx --bank=src/yuniqa/soundbank.ts --set=v2 --only=pop,whoosh
//
// The bank module exports SOUND_BANKS: { [set]: { dir, sounds: SfxSpec[] } }, where
// `dir` is relative to public/. Register the resulting files, with their volumes,
// in the brand's sound map (e.g. SFX in src/yuniqa/brand.ts).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export type SfxSpec = {
  readonly name: string;
  readonly prompt: string;
  /** 0.5 to 30. */
  readonly durationSeconds: number;
  /** 0 to 1: how literally the prompt is followed. */
  readonly promptInfluence: number;
};

export type SoundBanks = Record<string, { readonly dir: string; readonly sounds: readonly SfxSpec[] }>;

// Only run when invoked as a CLI; spec modules import the types above.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const arg = (name: string): string | null => {
    const found = process.argv.find((a) => a.startsWith(`--${name}=`));
    return found ? found.slice(name.length + 3) : null;
  };

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("ELEVENLABS_API_KEY is missing. Copy .env.example to .env.local and fill it in.");
    process.exit(1);
  }
  const bankPath = arg("bank");
  const setName = arg("set");
  if (!bankPath || !setName) {
    console.error("Usage: pnpm sfx --bank=<module exporting SOUND_BANKS> --set=<name> [--only=a,b]");
    process.exit(1);
  }
  const { SOUND_BANKS } = (await import(pathToFileURL(resolve(ROOT, bankPath)).href)) as { SOUND_BANKS: SoundBanks };
  const bank = SOUND_BANKS[setName];
  if (!bank) {
    console.error(`No set "${setName}" in ${bankPath}. Sets: ${Object.keys(SOUND_BANKS).join(", ")}`);
    process.exit(1);
  }
  const onlyArg = arg("only");
  const only = onlyArg ? new Set(onlyArg.split(",")) : null;
  const outDir = join(ROOT, "public", bank.dir);
  mkdirSync(outDir, { recursive: true });

  const todo = bank.sounds.filter((s) => !only || only.has(s.name));
  console.log(`Generating ${todo.length} sound effects → public/${bank.dir}`);
  for (const spec of todo) {
    const response = await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: spec.prompt,
        duration_seconds: spec.durationSeconds,
        prompt_influence: spec.promptInfluence,
      }),
    });
    if (!response.ok) {
      throw new Error(`ElevenLabs ${response.status} for ${spec.name}: ${await response.text()}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(join(outDir, `${spec.name}.mp3`), buffer);
    console.log(`  ${spec.name}: ${(buffer.length / 1024).toFixed(0)} KB (${spec.durationSeconds}s)`);
  }
  console.log("Done.");
}

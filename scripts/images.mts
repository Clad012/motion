// Generates still images with a Gemini image model.
//
//   pnpm images --set=src/yuniqa/images.ts
//   pnpm images --set=src/yuniqa/images.ts --only=diner,post
//
// The set module exports IMAGE_SET: { dir, images: [{ name, prompt }] }, with `dir`
// relative to public/. Images are written as <dir>/<name>.png.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export type ImageSpec = { readonly name: string; readonly prompt: string };
export type ImageSet = { readonly dir: string; readonly model?: string; readonly images: readonly ImageSpec[] };

const DEFAULT_MODEL = "gemini-3.1-flash-image";

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> } }>;
  error?: { message?: string };
};

// Only run when invoked as a CLI; set modules import the types above.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const arg = (name: string): string | null => {
    const found = process.argv.find((a) => a.startsWith(`--${name}=`));
    return found ? found.slice(name.length + 3) : null;
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Copy .env.example to .env.local and fill it in.");
    process.exit(1);
  }
  const setPath = arg("set");
  if (!setPath) {
    console.error("Usage: pnpm images --set=<module exporting IMAGE_SET> [--only=a,b]");
    process.exit(1);
  }
  const { IMAGE_SET } = (await import(pathToFileURL(resolve(ROOT, setPath)).href)) as { IMAGE_SET: ImageSet };
  const model = IMAGE_SET.model ?? DEFAULT_MODEL;
  const onlyArg = arg("only");
  const only = onlyArg ? new Set(onlyArg.split(",")) : null;
  const outDir = join(ROOT, "public", IMAGE_SET.dir);
  mkdirSync(outDir, { recursive: true });

  const todo = IMAGE_SET.images.filter((s) => !only || only.has(s.name));
  console.log(`Generating ${todo.length} images with ${model} → public/${IMAGE_SET.dir}`);
  for (const spec of todo) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: spec.prompt }] }] }),
      },
    );
    const json = (await response.json()) as GeminiResponse;
    if (!response.ok) {
      throw new Error(`Gemini ${response.status}: ${json.error?.message ?? "unknown error"}`);
    }
    const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
    if (!part?.inlineData?.data) {
      throw new Error(`No image returned for ${spec.name}`);
    }
    const buffer = Buffer.from(part.inlineData.data, "base64");
    writeFileSync(join(outDir, `${spec.name}.png`), buffer);
    console.log(`  ${spec.name}: ${(buffer.length / 1024).toFixed(0)} KB`);
  }
  console.log("Done.");
}

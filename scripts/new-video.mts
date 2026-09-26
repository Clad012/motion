// Creates a new video from a template and registers it, ready to open in the Studio.
//
//   pnpm new-video --project=generic --id=my-video
//   pnpm new-video --project=yuniqa --id=mon-sujet --template=phone-demo
//
// Templates live in src/generic/videos: starter (default), phone-demo, split-compare.
// The copy renders straight away, silent, with captions timed from script.ts; run
// `pnpm voiceover --video=<id>` to give it a voice.

import { cpSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATES = ["starter", "phone-demo", "split-compare"] as const;

const arg = (name: string): string | null => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : null;
};

const fail = (message: string): never => {
  console.error(message);
  process.exit(1);
};

const project = arg("project") ?? fail("Pass --project=<generic|yuniqa|…> (a folder of src/).");
const id = arg("id") ?? fail("Pass --id=<kebab-case-id>, e.g. --id=inbox-zero.");
const template = arg("template") ?? "starter";

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) fail(`--id must be kebab-case, got "${id}".`);
if (!TEMPLATES.includes(template as (typeof TEMPLATES)[number])) {
  fail(`--template must be one of ${TEMPLATES.join(", ")}.`);
}
const projectDir = join(ROOT, "src", project);
const registry = join(projectDir, "index.ts");
if (!existsSync(registry)) fail(`src/${project}/index.ts not found: is "${project}" a project folder?`);

const target = join(projectDir, "videos", id);
if (existsSync(target)) fail(`src/${project}/videos/${id} already exists.`);

const pascal = id.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
const camel = pascal[0].toLowerCase() + pascal.slice(1);

// 1. Copy the template, with an empty manifest (the template's voice is not copied).
const source = join(ROOT, "src", "generic", "videos", template);
cpSync(source, target, { recursive: true });
writeFileSync(
  join(target, "generated", "voiceover.json"),
  JSON.stringify({ voiceId: "", generatedAt: "", scenes: [] }, null, 2) + "\n",
);

// 2. Point its imports at the shared code from the new location.
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const isBrand = project !== "generic";
for (const file of walk(target).filter((f) => /\.(ts|tsx)$/.test(f))) {
  let text = readFileSync(file, "utf8");
  if (file.endsWith("script.ts")) {
    // Read by Node: stays relative, with the extension.
    const engine = relative(dirname(file), join(ROOT, "src/generic/engine/voiceover.ts"));
    text = text.replace(/from "\.\.\/\.\.\/engine\/voiceover\.ts"/, `from "${engine}"`);
  } else {
    text = text
      .replace(/from "\.\.\/\.\.\/engine"/g, 'from "@/generic/engine"')
      .replace(/from "\.\.\/\.\.\/components(\/[a-z]+)?"/g, 'from "@/generic/components$1"')
      .replace(/from "\.\.\/\.\.\/sounds"/g, 'from "@/generic/sounds"');
  }
  if (file.endsWith("video.tsx")) {
    // Only the composition id: script.ts also has `id:` keys, for its scenes.
    text = text.replace(/id: "[A-Za-z]+",/, `id: "${pascal}",`);
  }
  if (isBrand && file.endsWith("video.tsx")) {
    // A brand video uses the brand theme; the neutral one stays for generic videos.
    text = text
      .replace("neutralTheme, ", "")
      .replace(/(import manifest)/, `import { ${project}Theme } from "@/${project}/theme";\n$1`)
      .replace("theme: neutralTheme,", `theme: ${project}Theme,`);
  }
  writeFileSync(file, text);
}

// 3. Register it in the project's list, where the markers are.
let list = readFileSync(registry, "utf8");
if (!list.includes("// @new-video-import") || !list.includes("// @new-video-entry")) {
  fail(`src/${project}/index.ts has no // @new-video-import and // @new-video-entry markers.`);
}
list = list
  .replace("// @new-video-import", `// @new-video-import\nimport { video as ${camel} } from "./videos/${id}/video";`)
  .replace("// @new-video-entry", `// @new-video-entry\n  ${camel},`);
writeFileSync(registry, list);

console.log(`Created src/${project}/videos/${id} from "${template}" as composition "${pascal}".

Next:
  1. Write the lines in src/${project}/videos/${id}/script.ts (one per scene id).
  2. Draw each scene in scenes.tsx; keep the scene ids in video.tsx in sync.
  3. pnpm dev                          → open "${pascal}" in the Studio (silent preview)
  4. pnpm voiceover --video=${id}       → real voice, scenes re-timed from the audio
                                         (no key: --from-files or --from-file=<take.mp3>)
  5. pnpm lint                          → code, types, voice matches the script
  6. pnpm render ${pascal}              → out/${pascal}.mp4, checked for length and sound`);
if (isBrand && existsSync(join(projectDir, "voices.ts"))) {
  console.log(`\nBrand voices are in src/${project}/voices.ts; set VOICE_ID in script.ts to one of them.`);
}

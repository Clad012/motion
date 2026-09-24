# Motion

A reusable [Remotion](https://www.remotion.dev) system for short vertical videos (TikTok, Reels, Shorts): a
brand-free engine and component library in `src/generic`, and one brand built on it, `src/yuniqa`.

You write the lines, a voice is generated with word timings, and scene lengths, captions and animations follow
that audio. Change a line, regenerate the voice, the video re-times itself.

## Quick start

Node 24+ and pnpm.

```bash
pnpm install
pnpm assets     # music beds that are not committed
pnpm dev        # Remotion Studio
```

Keys (only to generate voices, sounds or images): copy `.env.example` to `.env.local`.

## How to read the project

```
src/
├── Root.tsx            registers every video, grouped by project
├── generic/            brand-free: engine/, components/, sounds.ts, videos/ (templates + examples)
└── yuniqa/             the Yuniqa brand: brand.ts, theme.ts, voices.ts, components/, videos/
scripts/                CLI tools: voiceover, sfx, images, new-video, stills, assets
public/                 fonts/geist, generic/ assets, yuniqa/ assets (voiceovers, images, sounds, logos)
```

A video is one folder, `src/<project>/videos/<id>/`:

| File | Role |
| --- | --- |
| `script.ts` | The lines (one per scene) and the voice id. Plain data, read by Node. |
| `scenes.tsx` | One component per scene. |
| `video.tsx` | `defineVideo({ id, theme, script, manifest, scenes })`. |
| `generated/voiceover.json` | Written by `pnpm voiceover`: durations and word timings. |

`src/generic` never imports a brand: components read colours and fonts from the theme. Details:
[src/generic/README.md](src/generic/README.md) (components) and [src/yuniqa/README.md](src/yuniqa/README.md) (brand).

## Videos

| Project | Composition | What it is |
| --- | --- | --- |
| generic | `Top5Prompts` | Example: five prompts for Claude, counted down on a real phone (English) |
| generic | `Starter`, `PhoneDemo`, `SplitCompare` | Templates used by `pnpm new-video` |
| yuniqa | `AppsPayantes`, `LeTest`, `DuelIA`, `Retour` | The brand's validated videos (French) |

## Commands

| Command | |
| --- | --- |
| `pnpm new-video --project=<p> --id=<id> [--template=starter\|phone-demo\|split-compare]` | New video, registered |
| `pnpm voiceover --video=<id>` | Voice + word timings (ElevenLabs). `--only=a,b`, `--list` |
| `pnpm sfx --bank=<module> --set=<name>` / `pnpm images --set=<module>` | Generate sounds / images |
| `pnpm stills <Id>` | Stills in `out/stills/<Id>/` to check a video |
| `pnpm render <Id>` | `out/<Id>.mp4` |
| `pnpm lint` | ESLint + TypeScript |

Agents: read [AGENTS.md](AGENTS.md).

## Licences

Geist fonts: SIL OFL 1.1. Voiceovers, sounds and images were generated for this project (ElevenLabs, Gemini).
Music beds are fetched by `pnpm assets`, not redistributed. The Yuniqa name, mark and copy belong to Yuniqa;
logos in `public/yuniqa/logos` (Simple Icons) belong to their owners. Remotion has
[its own licence](https://www.remotion.pro/license).

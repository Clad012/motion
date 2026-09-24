# Guide for agents

Read [README.md](README.md) first for the layout. On a brand, its README wins over this file
([src/yuniqa/README.md](src/yuniqa/README.md)). If `CLAUDE.local.md` or `AGENTS.local.md` exists, read it too.

## Make a video

```bash
pnpm new-video --project=<generic|yuniqa> --id=<kebab-id> --template=<starter|phone-demo|split-compare>
```

1. Write `script.ts` (story), then `scenes.tsx` (picture). Same scene ids in both, and in `video.tsx`.
2. `pnpm voiceover --video=<id>`: real voice; scenes re-time themselves. Before that, it plays silent with captions.
3. `pnpm lint`, then `pnpm stills <Id>` and look at every PNG. Then `pnpm render <Id>`.

The best worked example is `src/generic/videos/top-5-prompts`.

- `script.ts`: exports `VOICE_ID` and `SCRIPT: ScriptLine[]` (`{ id, voice, tailMs }`). Node reads it: no React, no
  `@/` alias, relative imports keep `.ts`.
- `scenes.tsx`: `React.FC<SceneProps>`; frame 0 is the scene's first frame. Time things on words:
  `wordFrame(words, "word")`.
- Components: `@/generic/components` (CloseUpStage, IPhone, ChatScreen, SplitStage, Captions, EndCard, Glyph…),
  catalogue in [src/generic/README.md](src/generic/README.md). Colours and fonts from `useTheme()`.

## Preferred format

- 1080×1920, 30 fps, 25–45 s, 6–12 scenes, one idea per scene, 6–15 spoken words per line.
- Captions always on; they own the band around y = 1380–1480. Screens inside phones take `bottomReserve` ≈ 0.22.
- Safe area: 90 px sides, 220 px top, 420 px bottom (`SAFE`).
- Levels: voice 1, music 0.06–0.08, effects 0.06–0.2.

## Voices (ElevenLabs)

| Voice | Id | Use |
| --- | --- | --- |
| Léo — French, male, energetic | `jsScnYkNNda9Q1NES5nn` | Yuniqa default |
| Chloé — French, female, warm | `Hy28BjVfgieDVMiyQpQe` | Yuniqa, softer videos |
| George — English, male, narrator | `JBFqnCBsd6RMkjVDRZzb` | Generic default |

Default model `eleven_multilingual_v2`. `eleven_v3` is more expressive but ~40 % slower. French scripts add
`export const LANGUAGE_CODE = "fr"`.

## Sounds

- Generic, `<Sound name="…" from={f} />` from `@/generic/sounds`: `sweep`, `tap`, `cardIn`, `confirm`, `ping`,
  `pop`, `whoosh`, `keyboard`, `messageOut`, `messageIn`.
- Yuniqa, `<Sfx name="…" from={f} />` from `@/yuniqa/components`: the quiet glass-and-air set `listenOn`,
  `listenOff`, `cardIn`, `confirm`, `sweep`, `tap`, `swell`, `ping`, plus `whoosh`, `swipe`, `pop`, `click`,
  `notification`, `success`, `error`, `stamp`, `tick`, `whip`, `impact`, `messageOut`, `messageIn`,
  `magicReveal`, `keyboard`.
- New sound: add a prompt to the bank, `pnpm sfx`, then register it with a volume. No hard-coded files.

## What works (learned the hard way)

- **Motion everywhere.** Slow camera push, springs, stickers and cards landing on the spoken word. Never a
  static frame.
- **A real iPhone, close, on a real photo** (`CloseUpStage`). Flat cards on black and small phones lost in empty
  space were rejected.
- **Problem first, then the fix.** A feature tour without a problem does not hold.
- **Hook in the first second**, on screen and in the voice. `leadInMs: 2000` can open on the picture alone.
- **Short lines, real product copy**, brand named only at the end (Yuniqa: last two scenes).
- **Quiet, premium sound** under the voice. No riser.
- **Avoid gimmicks** that need explaining (a stopwatch race, data-heavy charts).
- **Unsure of the direction?** Show two 5-second look tests before building a full video.

## Rules

- Animate only from `useCurrentFrame()` + `interpolate()`; CSS transitions and animations do not render.
- Assets live in `public/`, loaded with `staticFile()`. Remote files need CORS.
- Never edit `generated/`. Keep `src/generic` free of any brand.
- Refactoring shared code: renders are byte-deterministic, so compare still checksums before and after.
- Keys are in `.env.local`. Never print or commit them.

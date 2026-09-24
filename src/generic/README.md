# Generic system

The brand-agnostic half of the repository: the engine that turns a script and its voiceover into a timed video,
and the components scenes are built from. Nothing here knows about a brand; everything visual reads the theme.

```ts
import { defineVideo, useTheme, wordFrame, type SceneProps } from "@/generic/engine";
import { CloseUpStage, ChatScreen, Captions, EndCard } from "@/generic/components";
import { Sound } from "@/generic/sounds";
```

## Engine — `@/generic/engine`

| Export | What it is |
| --- | --- |
| `FPS`, `WIDTH`, `HEIGHT`, `SAFE` | 30 fps, 1080×1920, and the safe area (`x: 90`, `top: 220`, `bottom: 420`) |
| `Theme`, `neutralTheme`, `ThemeProvider`, `useTheme()` | Colours (`bg`, `surface`, `surfaceRaised`, `ink`, `inkMuted`, `inkFaint`, `success`, `warning`, `error`, `info`), fonts, caption highlight, default music, font loader |
| `defineVideo({ id, angle, theme, script, manifest, scenes, music?, leadInMs? })` | The way to declare a video: silent from the script until a matching voiceover exists, then voiced |
| `defineVoicedVideo`, `defineSilentVideo` | One mode only |
| `VideoEntry` | What the registries hold and `Root.tsx` registers |
| `ScriptLine`, `VoiceoverManifest`, `VoiceoverWord`, `EMPTY_MANIFEST` | Script and manifest types |
| `buildTimeline(manifest, { leadInMs })`, `buildSilentTimeline(scenes)`, `totalDuration` | Timelines, if you assemble a video by hand |
| `SceneProps` (`words`, `durationInFrames`), `SceneMap` | What every scene component receives |
| `wordFrame(words, needle, fallback?, occurrence?)`, `wordEndFrame`, `msToFrames` | Frame at which a spoken word starts or ends, local to the scene |
| `VideoShell`, `SceneWithVoice` | Plays scenes back to back with music and each scene's voice |
| `loadGeistFonts`, `GEIST`, `GEIST_MONO` | The bundled Geist fonts |

Scene frames are local: frame 0 is the first frame of the scene. `wordFrame` matches the start of a word with
accents and punctuation stripped (`"reponse"` finds `réponse.`).

## Components — `@/generic/components`

Every component reads colours and fonts from `useTheme()`. Positions are in frame pixels (1080×1920) unless noted.

### Device — `@/generic/components/device`

| Component | Props | Notes |
| --- | --- | --- |
| `CloseUpStage` | `words`, `background` (image path in `public/`), `children` (the screen), `seed?`, `tint?`, `overlay?`, `captionWords?` | The phone close up on a blurred photographed room, slow push-in, device settling upright, captions included. `seed` alternates the drift so neighbouring scenes differ. Screens inside use `CLOSE_UP_SCREEN_SCALE`. |
| `IPhone` | `width`, `children`, `time?`, `tiltY?`, `glare?` | Titanium rim, Dynamic Island, status bar, home indicator, glass glare. Children fill the screen below the status bar. |
| `PhoneFrame` | `width?`, `title?`, `children` | A flat, simpler phone. |
| `IPHONE_RATIO`, `SCREEN_HEIGHT_BASE` | | Height/width ratio; screen height at the reference width 430, to size reserves. |

### Chat — `@/generic/components/chat`

| Component | Props | Notes |
| --- | --- | --- |
| `ChatScreen` | `scale`, `title`, `messages: ChatMessage[]`, `avatar?`, `avatarBackground?`, `accent?`, `bottomReserve?` | A messaging app: header, bubbles that spring in, typing dots (`typingFor` frames before a reply), composer. Pass a brand mark as `avatar`. |
| `ChatMessage` | `{ id, role: "user" \| "assistant", text, from, typingFor? }` | `from` is the local frame the bubble lands on; `from: -200` shows it from the start. |
| `ChatBubble` | `role`, `from`, `width`, `children` | A single bubble, outside a phone. |

### Split screen — `@/generic/components/split`

| Component | Props | Notes |
| --- | --- | --- |
| `SplitStage` | `words`, `header?`, `top`, `bottom`, `children?` | Two stacked panels and captions. Each side: `{ label, content, badge?, badgeAt?, dimmed?, from? }`. The top side is the muted one. |
| `SplitPanel` | `side: "before" \| "after"`, `label`, `top`, `from?`, `badge?`, `badgeAt?`, `dimmed?`, `children` | One panel, if you lay them out yourself. |
| `BigStat` | `value`, `label`, `from?`, `color?` | A large number or word with a caption. |
| `PanelRow` | `label`, `detail?`, `from`, `glyph?`, `accent?`, `struck?` | A checklist row. |
| `SeamBadge` | `children`, `from`, `top`, `background?` | A pill sitting on the seam between the panels. |
| `PANEL_LEFT`, `PANEL_WIDTH`, `PANEL_HEIGHT`, `TOP_PANEL_Y`, `BOTTOM_PANEL_Y`, `CAPTION_Y`, `HEADER_Y` | | The split layout. |

### Text — `@/generic/components/text`

| Component | Props | Notes |
| --- | --- | --- |
| `Captions` | `words`, `y?`, `fontSize?`, `tone?: "dark" \| "light"` | TikTok-style pages, the spoken word highlighted in `theme.captionHighlight`. Use `tone="light"` on a light background. |
| `TypeText` | `text`, `from`, `charsPerFrame?`, `cursor?` | Characters appear one by one, with a caret. |

### Everything else

| Component | Props | Notes |
| --- | --- | --- |
| `EndCard` (cards) | `brand`, `lines`, `cta?`, `from?`, `ctaFrom?` | Closing card on the inverted palette. |
| `Background` (backgrounds) | `tone?` | Two slow halos and a vignette on `colors.bg`. |
| `ResultRow` (ui) | `label`, `from`, `width`, `glyph?`, `accent?`, `strike?` | A result line with a round icon. |
| `AppTile` (ui) | `label`, `glyph`, `size?`, `price?`, `tone?` | An app icon tile, optionally with a price badge. |
| `Glyph` (icons) | `name`, `size`, `color`, `strokeWidth?` | Line icons: tasks, notes, budget, meals, mail, ai, bell, check, moon, clock, camera, cross, flame. |
| `Sfx` (audio) | `src`, `from`, `volume` | A sound file on a local frame. |
| `createNamedSfx(bank)` (audio) | | Returns a typed `<Sfx name="…" from={…} />` for a bank `{ name: { file, volume } }`. |
| `voiceLevel(words, frame, fps)` (voice) | | 0..1 envelope of the voice (fast attack, slow release), to drive anything by speech. |

## Sounds — `@/generic/sounds`

`<Sound name="pop" from={12} />`: `sweep`, `tap`, `cardIn`, `confirm`, `ping`, `pop`, `whoosh`, `keyboard`,
`messageOut`, `messageIn` (files in `public/generic/sfx`). Brands define their own bank the same way.

## Videos — `src/generic/videos`

- `top-5-prompts`: the full example (a countdown on a real phone, stickers on the spoken word, typed prompts).
- Templates for `pnpm new-video`: `starter` (silent until voiced), `phone-demo`, `split-compare`.

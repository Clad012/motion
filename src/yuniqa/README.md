# Yuniqa

Marketing videos for [Yuniqa](https://yuniqa.ai), the all-in-one AI app, built on the generic system. Vertical
1080×1920, French voiceover, made for TikTok.

## Brand rules

These override the generic defaults for every Yuniqa video.

- **The brand is named last.** Never in the hook: "Yuniqa" appears only in the last two scenes (reveal, then
  closing card).
- **Problem first, then the fix.** Show the viewer's problem in its own scenes, then how the app solves it. A feature
  tour with no problem does not work.
- **The real app, close.** A realistic iPhone filling most of the frame on a photographed room (`CloseUpStage`),
  with the app's own screens and its own French strings inside. Flat cards on a dark background and small phones
  in empty space were rejected.
- **Short spoken lines.** One idea per shot, tutoiement, oral French. Default voice: Léo.
- **Quiet sound.** The glass-and-air set (`sfx-v3`) under the voice. Never a riser.
- **Hook in the first second**, on screen and in the voice at once. `leadInMs: 2000` is available to open on two
  seconds of picture when the first shot tells the story on its own.

Copy comes from the app: mirror the strings of the Yuniqa mobile app (French messages file of the app repository)
rather than inventing product wording. Signals, for instance: « Pendant votre absence », « requièrent votre
attention », « traités pendant votre sommeil ».

**Working with the brand owner:** when feedback on a video is only "it's bad", do not build another full video.
Make two 5-second look tests of different directions and ask which one is closer.

## What is here

| File | Contents |
| --- | --- |
| `brand.ts` | `COLORS` (monochrome: `#080808`, `#F0EFEC`, `#1C1C1A`), `FONT_FAMILY` (Geist), `SFX` (sound bank with levels), `MUSIC_FILE`, plus the shared format |
| `theme.ts` | `yuniqaTheme`, what the generic components need to look like Yuniqa |
| `voices.ts` | `VOICES.leo`, `VOICES.chloe` (ElevenLabs, French) |
| `soundbank.ts` | Prompts for `pnpm sfx --bank=src/yuniqa/soundbank.ts --set=v2\|v3` |
| `images.ts` | Prompts for `pnpm images --set=src/yuniqa/images.ts` (the rooms behind the phone) |
| `components/` | `LogoMark` (the four-dot mark, animatable), `SplitReveal` and `SplitCta` (reveal and closing card), `VoiceOrb` and `VoiceScreen` (the app's live voice mode), `Sfx` (named, typed sound effects) |
| `index.ts` | `YUNIQA_VIDEOS`, the registry |

```ts
import { COLORS, FONT_FAMILY } from "@/yuniqa/brand";
import { yuniqaTheme } from "@/yuniqa/theme";
import { LogoMark, Sfx, SplitCta } from "@/yuniqa/components";
```

Reusable screens that live in a video folder (import with `@/yuniqa/videos/<id>/components/…`):
`retour` has `ChaosScreen` (lock screen and inbox in chaos) and `BriefScreen` (« pendant votre absence »);
`duel-ia` has `DuelStage` (two phones side by side).

## Videos

The four validated videos. **Retour** is the reference look (problem then fix, close-up phone on a real room).

| Composition | Folder | Angle |
| --- | --- | --- |
| `Retour` | `retour` | Coming back to an inbox on fire, or to the « pendant votre absence » brief |
| `DuelIA` | `duel-ia` | Two iPhones, the same question sent to two AIs at once |
| `LeTest` | `le-test` | Split screen: an AI that answers against an AI that acts |
| `AppsPayantes` | `apps-payantes` | Subscription fatigue: six paid apps replaced by one |

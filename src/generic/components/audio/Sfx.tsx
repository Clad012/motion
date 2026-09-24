import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

type SfxProps = {
  /** File relative to public/. */
  readonly src: string;
  /** Local frame at which the effect starts. */
  readonly from: number;
  /** 0..1, relative to a voice at 1. Keep effects well under the voice. */
  readonly volume: number;
};

// One-shot sound effect at a local frame. Brands wrap this with named sounds (see yuniqa/components/Sfx).
export const Sfx: React.FC<SfxProps> = ({ src, from, volume }) => (
  <Sequence from={from} layout="none">
    <Audio src={staticFile(src)} volume={() => volume} />
  </Sequence>
);

export type SoundBank = Readonly<Record<string, { readonly file: string; readonly volume: number }>>;

type NamedSfxProps<Name extends string> = {
  readonly name: Name;
  readonly from: number;
  /** Overrides the bank's default level. */
  readonly volume?: number;
};

/**
 * Turns a sound bank into a typed <Sfx name="…" /> component, so a typo in a sound
 * name is a type error. Each brand exports one (see src/yuniqa/components/Sfx.tsx).
 */
export const createNamedSfx = <Bank extends SoundBank>(bank: Bank): React.FC<NamedSfxProps<keyof Bank & string>> => {
  const NamedSfx: React.FC<NamedSfxProps<keyof Bank & string>> = ({ name, from, volume }) => (
    <Sfx src={bank[name].file} from={from} volume={volume ?? bank[name].volume} />
  );
  NamedSfx.displayName = "NamedSfx";
  return NamedSfx;
};

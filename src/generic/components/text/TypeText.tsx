import { useCurrentFrame } from "remotion";

type TypeTextProps = {
  readonly text: string;
  /** Local frame at which typing starts. */
  readonly from: number;
  readonly charsPerFrame?: number;
  readonly cursor?: boolean;
};

// Character-by-character reveal, deterministic per frame.
export const TypeText: React.FC<TypeTextProps> = ({ text, from, charsPerFrame = 1.6, cursor = true }) => {
  const frame = useCurrentFrame();
  const count = Math.max(0, Math.min(text.length, Math.floor((frame - from) * charsPerFrame)));
  const done = count >= text.length;
  const showCursor = cursor && !done && frame >= from && Math.floor(frame / 8) % 2 === 0;
  return (
    <span>
      {text.slice(0, count)}
      {showCursor ? <span style={{ opacity: 0.7 }}>|</span> : null}
    </span>
  );
};

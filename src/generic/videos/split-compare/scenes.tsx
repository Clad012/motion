import { AbsoluteFill } from "remotion";
import { BigStat, Captions, EndCard, PanelRow, SeamBadge, SplitStage } from "../../components";
import { BOTTOM_PANEL_Y } from "../../components/split";
import { useTheme, wordFrame, type SceneProps } from "../../engine";
import { Sound } from "../../sounds";

const TOP = "assistant 1";
const BOTTOM = "assistant 2";

// Hook: two empty panels and the promise that only one delivers.
export const HookScene: React.FC<SceneProps> = ({ words }) => (
  <SplitStage
    words={words}
    header="same request · two assistants"
    top={{ label: TOP, content: <BigStat value="?" label="waiting" /> }}
    bottom={{ label: BOTTOM, from: 6, content: <BigStat value="?" label="waiting" /> }}
  >
    <Sound name="whoosh" from={0} />
  </SplitStage>
);

// The muted side answers with advice.
export const BeforeScene: React.FC<SceneProps> = ({ words }) => {
  const at = wordFrame(words, "ten", 20) - 4;
  return (
    <SplitStage
      words={words}
      top={{
        label: TOP,
        badge: "0 done",
        badgeAt: wordFrame(words, "leaves", 40),
        content: <BigStat value="10 tips" label="and the work is still yours" from={at} />,
      }}
      bottom={{ label: BOTTOM, dimmed: true, content: <BigStat value="…" label="working" /> }}
    >
      <Sound name="tap" from={at} />
    </SplitStage>
  );
};

// The lit side lists what it actually did, each row on its verb.
export const AfterScene: React.FC<SceneProps> = ({ words }) => {
  const { colors } = useTheme();
  const rows = [
    { label: "Inbox opened", at: wordFrame(words, "opens", 20) },
    { label: "212 emails cleared", at: wordFrame(words, "clears", 40) },
    { label: "Call booked, Thursday 14:00", at: wordFrame(words, "books", 60) },
  ];
  return (
    <SplitStage
      words={words}
      top={{ label: TOP, dimmed: true, content: <BigStat value="10 tips" label="and the work is still yours" /> }}
      bottom={{
        label: BOTTOM,
        badge: "done",
        badgeAt: rows[2].at + 10,
        content: (
          <div style={{ display: "flex", flexDirection: "column", gap: 26, paddingTop: 40 }}>
            {rows.map((row) => (
              <PanelRow key={row.label} label={row.label} from={row.at} accent={colors.success} />
            ))}
          </div>
        ),
      }}
    >
      {rows.map((row) => (
        <Sound key={row.label} name="pop" from={row.at} />
      ))}
      <Sound name="confirm" from={rows[2].at + 10} />
    </SplitStage>
  );
};

// Verdict: the two panels summed up in two words, with a badge on the seam.
export const VerdictScene: React.FC<SceneProps> = ({ words }) => {
  const { colors } = useTheme();
  const acts = wordFrame(words, "acts", 20);
  return (
    <SplitStage
      words={words}
      top={{ label: TOP, content: <BigStat value="talks" label="advice" color={colors.inkMuted} /> }}
      bottom={{ label: BOTTOM, content: <BigStat value="acts" label="results" from={acts} color={colors.success} /> }}
    >
      <SeamBadge from={acts} top={BOTTOM_PANEL_Y - 40}>
        pick this one
      </SeamBadge>
      <Sound name="ping" from={acts} />
    </SplitStage>
  );
};

export const EndScene: React.FC<SceneProps> = ({ words }) => (
  <AbsoluteFill>
    <Sound name="confirm" from={4} />
    <EndCard brand="Motion" lines={["Pick the one", "that acts."]} from={2} />
    <Captions words={words} tone="light" />
  </AbsoluteFill>
);

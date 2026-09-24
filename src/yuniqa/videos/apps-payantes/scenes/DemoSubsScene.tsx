import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { Sfx } from "@/yuniqa/components";
import { SubscriptionRow } from "../components/SubscriptionRow";
import { wordFrame, type SceneProps } from "@/generic/engine";

// Brand marks from Simple Icons (public/yuniqa/logos, CDN: cdn.simpleicons.org).
const SUBS = [
  { name: "Netflix", logo: "netflix", price: 13.49, note: "renouvelé le 4" },
  { name: "Duolingo", logo: "duolingo", price: 13.99, note: "renouvellement demain", flag: "warning" as const },
  { name: "Spotify", logo: "spotify", price: 10.99, note: "prix +1 € ce mois" },
  { name: "Headspace", logo: "headspace", price: 12.99, note: "jamais ouverte", flag: "cancel" as const },
  { name: "Dropbox", logo: "dropbox", price: 11.99, note: "doublon avec Drive", flag: "cancel" as const },
];

const CARD_LEFT = 110;
const CARD_WIDTH = WIDTH - 220;

// Demo 3: forgotten subscriptions surface, the renewal warning fires, two get flagged to cancel.
export const DemoSubsScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const listStart = wordFrame(words, "liste", 60) - 4;
  const warnStart = wordFrame(words, "previent", 110);
  const cancelStart = wordFrame(words, "annuler", 190) - 2;
  const total = SUBS.reduce((sum, s) => sum + s.price, 0);
  const shownTotal = interpolate(frame, [listStart, listStart + 1.1 * fps], [0, total], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const savings = SUBS.filter((s) => s.flag === "cancel").reduce((sum, s) => sum + s.price, 0);

  return (
    <AbsoluteFill>
      <Background />
      <Sfx name="swipe" from={0} />
      <Sfx name="notification" from={warnStart} />
      <Sfx name="success" from={cancelStart + 6} />

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 205,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          color: COLORS.ink,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.inkMuted, letterSpacing: 5, textTransform: "uppercase" }}>
          abonnements
        </div>
        <div style={{ fontSize: 130, fontWeight: 900, letterSpacing: -5, lineHeight: 1.05 }}>
          {shownTotal.toFixed(2).replace(".", ",")} €
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, color: COLORS.inkMuted, marginTop: -4 }}>par mois, retrouvés</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: CARD_LEFT,
          width: CARD_WIDTH,
          top: 590,
          borderRadius: 40,
          backgroundColor: COLORS.surfaceRaised,
          border: "2px solid rgba(240,239,236,0.10)",
          padding: "10px 36px",
          display: "flex",
          flexDirection: "column",
          opacity: interpolate(frame, [listStart, listStart + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {SUBS.map((sub, i) => (
          <SubscriptionRow
            key={sub.name}
            name={sub.name}
            logo={sub.logo}
            price={sub.price}
            note={sub.note}
            flag={sub.flag}
            from={listStart + 4 + i * 5}
            warnAt={warnStart}
            cancelAt={cancelStart}
            width={CARD_WIDTH}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 1135,
          display: "flex",
          justifyContent: "center",
          fontFamily: FONT_FAMILY,
          opacity: interpolate(frame, [cancelStart + 6, cancelStart + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [cancelStart + 6, cancelStart + 18], [1.6, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 1.3, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.success,
            color: "#06200f",
            fontSize: 52,
            fontWeight: 900,
            padding: "12px 40px",
            borderRadius: 999,
            rotate: "-2deg",
            boxShadow: "0 20px 60px rgba(74,222,128,0.3)",
          }}
        >
          −{savings.toFixed(2).replace(".", ",")} € / mois
        </div>
      </div>

      <Captions words={words} />
    </AbsoluteFill>
  );
};

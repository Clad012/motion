import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "@/yuniqa/brand";
import { Glyph, type GlyphName } from "@/generic/components/icons";
import { SCREEN_HEIGHT_BASE } from "@/generic/components/device";

type ChaosScreenProps = {
  readonly scale: number;
  /** "lock": notifications pile up on the lock screen. "inbox": the unread list, then a frantic scroll. */
  readonly mode: "lock" | "inbox";
  readonly bottomReserve?: number;
  /** Local frame at which the frantic scrolling starts (inbox only). */
  readonly scrollFrom?: number;
  /** Red line under the header, e.g. the time and what is left to read. */
  readonly banner?: string;
  readonly bannerFrom?: number;
};

const BANNERS: Array<{ app: string; glyph: GlyphName; title: string; body: string; count: number }> = [
  { app: "Mail", glyph: "mail", title: "230 nouveaux messages", body: "Marc, Compta, Netflix, Léa, EDF…", count: 230 },
  { app: "Messages", glyph: "notes", title: "14 messages", body: "« t'as vu le devis ? »", count: 14 },
  { app: "Agenda", glyph: "clock", title: "Rendez-vous déplacé", body: "Jeudi 9 h → 11 h", count: 3 },
  { app: "Banque", glyph: "budget", title: "Prélèvement à venir", body: "Netflix · 15,99 € (+2 €)", count: 2 },
];

const SENDERS = [
  ["Newsletter Tech", "Les 10 outils de la semaine"],
  ["Marc Ferrand", "Re: devis n° 214 — on signe ?"],
  ["Amazon", "Votre commande a été expédiée"],
  ["Compta", "Facture à signer avant vendredi"],
  ["Netflix", "Votre tarif évolue"],
  ["LinkedIn", "Vous avez 12 nouvelles notifications"],
  ["EDF", "Votre facture est disponible"],
  ["Léa", "Jeudi, on décale à 11 h ?"],
  ["Promo", "−40 % ce week-end seulement"],
  ["Slack", "3 messages non lus dans #projet"],
  ["Doctolib", "Rappel de rendez-vous"],
  ["Spotify", "Nouveau prix à partir du 1er"],
];

// What coming back to a phone that was left alone looks like.
export const ChaosScreen: React.FC<ChaosScreenProps> = ({ scale, mode, bottomReserve = 0, scrollFrom, banner, bannerFrom = 0 }) => {
  const frame = useCurrentFrame();

  if (mode === "lock") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          fontFamily: FONT_FAMILY,
          paddingBottom: bottomReserve * SCREEN_HEIGHT_BASE * scale,
        }}
      >
        <div style={{ textAlign: "center", marginTop: 18 * scale }}>
          <div style={{ fontSize: 20 * scale, fontWeight: 600, color: COLORS.inkMuted }}>dimanche 21:47</div>
          <div style={{ fontSize: 86 * scale, fontWeight: 700, letterSpacing: -3 * scale, color: COLORS.ink, lineHeight: 1 }}>
            21:47
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10 * scale, padding: `0 ${16 * scale}px` }}>
          {BANNERS.map((banner, i) => {
            const from = 4 + i * 7;
            return (
              <div
                key={banner.app}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12 * scale,
                  padding: `${13 * scale}px ${15 * scale}px`,
                  borderRadius: 22 * scale,
                  backgroundColor: "rgba(240,239,236,0.10)",
                  backdropFilter: "blur(20px)",
                  opacity: interpolate(frame, [from, from + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  translate: interpolate(frame, [from, from + 14], [`0px ${-40 * scale}px`, "0px 0px"], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                }}
              >
                <div
                  style={{
                    width: 44 * scale,
                    height: 44 * scale,
                    borderRadius: 12 * scale,
                    backgroundColor: "rgba(240,239,236,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <Glyph name={banner.glyph} size={24 * scale} color={COLORS.ink} strokeWidth={2.2} />
                  <div
                    style={{
                      position: "absolute",
                      top: -8 * scale,
                      right: -10 * scale,
                      minWidth: 26 * scale,
                      height: 26 * scale,
                      padding: `0 ${7 * scale}px`,
                      borderRadius: 999,
                      backgroundColor: COLORS.error,
                      color: "#fff",
                      fontSize: 15 * scale,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {banner.count}
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 * scale }}>
                    <div style={{ fontSize: 17 * scale, fontWeight: 700, color: COLORS.ink }}>{banner.app}</div>
                    <div style={{ fontSize: 15 * scale, color: COLORS.inkMuted }}>il y a 2 j</div>
                  </div>
                  <div style={{ fontSize: 18 * scale, fontWeight: 600, color: COLORS.ink, marginTop: 2 * scale }}>{banner.title}</div>
                  <div style={{ fontSize: 16 * scale, color: COLORS.inkMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {banner.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Inbox: a list that keeps growing, then scrolls in a panic.
  const unread = Math.round(
    interpolate(frame, [0, 40], [180, 230], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const scrolling = scrollFrom !== undefined && frame >= scrollFrom;
  const scroll = scrolling ? ((frame - scrollFrom) * 26 * scale) % (SENDERS.length * 74 * scale) : 0;

  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", fontFamily: FONT_FAMILY, overflow: "hidden" }}>
      <div style={{ padding: `${10 * scale}px ${18 * scale}px ${12 * scale}px`, borderBottom: "1px solid rgba(240,239,236,0.10)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26 * scale, fontWeight: 800, color: COLORS.ink, whiteSpace: "nowrap" }}>Boîte de réception</div>
          <div
            style={{
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontSize: 17 * scale,
              fontWeight: 800,
              color: "#fff",
              backgroundColor: COLORS.error,
              padding: `${4 * scale}px ${12 * scale}px`,
              borderRadius: 999,
            }}
          >
            {unread} non lus
          </div>
        </div>
        {banner ? (
          <div
            style={{
              marginTop: 10 * scale,
              fontSize: 17 * scale,
              fontWeight: 800,
              color: COLORS.error,
              opacity: interpolate(frame, [bannerFrom, bannerFrom + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            {banner}
          </div>
        ) : null}
      </div>
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
          marginBottom: bottomReserve * SCREEN_HEIGHT_BASE * scale,
          maskImage: "linear-gradient(180deg, #000 82%, transparent 100%)",
        }}
      >
        <div
          style={{
            translate: `0px ${-scroll}px`,
            filter: scrolling ? "blur(1.2px)" : undefined,
          }}
        >
          {[...SENDERS, ...SENDERS].map(([sender, subject], i) => {
            const from = i < SENDERS.length ? 2 + i * 3 : 0;
            return (
              <div
                key={`${sender}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12 * scale,
                  padding: `${12 * scale}px ${18 * scale}px`,
                  height: 74 * scale,
                  borderBottom: "1px solid rgba(240,239,236,0.07)",
                  opacity: interpolate(frame, [from, from + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                <div style={{ width: 10 * scale, height: 10 * scale, borderRadius: "50%", backgroundColor: COLORS.info, flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 * scale }}>
                    <div style={{ fontSize: 19 * scale, fontWeight: 700, color: COLORS.ink }}>{sender}</div>
                    <div style={{ fontSize: 15 * scale, color: COLORS.inkMuted }}>sam.</div>
                  </div>
                  <div style={{ fontSize: 17 * scale, color: COLORS.inkMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {subject}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

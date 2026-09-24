import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "@/yuniqa/brand";
import { Glyph, type GlyphName } from "@/generic/components/icons";
import { SCREEN_HEIGHT_BASE } from "@/generic/components/device";

export type AttentionItem = {
  readonly id: string;
  readonly glyph: GlyphName;
  readonly title: string;
  readonly body: string;
  readonly action: string;
  readonly done?: string;
};

type BriefScreenProps = {
  readonly scale: number;
  readonly bottomReserve?: number;
  /** "loading" mirrors the app's loader copy, "brief" the signals brief itself. */
  readonly stage: "loading" | "brief";
  readonly headlineFrom?: number;
  /** Frames at which each attention card appears; hidden when omitted. */
  readonly attentionFrom?: number[];
  /** Frames at which each card's action gets pressed; omitted = never. */
  readonly actionAt?: number[];
  /** Frame at which the handled section appears (collapsed). */
  readonly handledFrom?: number;
  /** Frame at which it expands and lists its rows. */
  readonly handledOpenFrom?: number;
  /** Smaller headline, no handled section: leaves room for the three cards. */
  readonly compact?: boolean;
};

// Mirrors the app's brief: away window, narrative headline, attention cards with
// their actions, then everything handled while you were away.
export const ATTENTION: AttentionItem[] = [
  { id: "marc", glyph: "mail", title: "Marc attend le devis", body: "Réponse rédigée · à relire", action: "Relire", done: "Envoyé" },
  { id: "netflix", glyph: "budget", title: "Netflix coûte maintenant 15,99 €", body: "De 13,99 € à 15,99 €", action: "Vérifier", done: "Vu" },
  { id: "edf", glyph: "tasks", title: "1 tâche est en retard", body: "La plus ancienne : Payer la facture EDF", action: "Ouvrir les tâches", done: "Planifiée" },
];

const HANDLED = [
  { glyph: "mail" as GlyphName, label: "212 mails triés et archivés" },
  { glyph: "budget" as GlyphName, label: "9 factures classées dans Budget" },
  { glyph: "bell" as GlyphName, label: "3 abonnements surveillés" },
  { glyph: "notes" as GlyphName, label: "1 note classée depuis Gmail" },
];

const Bold: React.FC<{ readonly children: string }> = ({ children }) => (
  <span style={{ color: COLORS.ink, fontWeight: 800 }}>{children}</span>
);

export const BriefScreen: React.FC<BriefScreenProps> = ({
  scale,
  bottomReserve = 0,
  stage,
  headlineFrom = 0,
  attentionFrom,
  actionAt,
  handledFrom,
  handledOpenFrom,
  compact = false,
}) => {
  const frame = useCurrentFrame();

  if (stage === "loading") {
    const steps = ["Connexion à vos signaux", "Lecture de ce que vous avez manqué", "Préparation de votre brief"];
    const step = Math.min(steps.length - 1, Math.floor(frame / 22));
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18 * scale,
          fontFamily: FONT_FAMILY,
          paddingBottom: bottomReserve * SCREEN_HEIGHT_BASE * scale,
        }}
      >
        <div style={{ display: "flex", gap: 10 * scale }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 12 * scale,
                height: 12 * scale,
                borderRadius: "50%",
                backgroundColor: COLORS.ink,
                opacity: interpolate((frame - i * 6) % 30, [0, 10, 20, 30], [0.25, 1, 0.25, 0.25], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 22 * scale, fontWeight: 600, color: COLORS.inkMuted }}>{steps[step]}</div>
      </div>
    );
  }

  const handledOpen = handledOpenFrom !== undefined && frame >= handledOpenFrom;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 14 * scale,
        padding: `${8 * scale}px ${18 * scale}px`,
        paddingBottom: bottomReserve * SCREEN_HEIGHT_BASE * scale,
        fontFamily: FONT_FAMILY,
        color: COLORS.ink,
        overflow: "hidden",
      }}
    >
      {/* Away window */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8 * scale,
          fontSize: 16 * scale,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: COLORS.inkMuted,
          opacity: interpolate(frame, [headlineFrom, headlineFrom + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <span>2 j d'absence</span>
        <span>·</span>
        <span>218 signaux</span>
        <span>·</span>
        <span>4 apps</span>
      </div>

      {/* Narrative headline */}
      <div
        style={{
          fontSize: (compact ? 26 : 34) * scale,
          fontWeight: 600,
          lineHeight: 1.22,
          letterSpacing: -0.5,
          color: COLORS.inkMuted,
          opacity: interpolate(frame, [headlineFrom + 4, headlineFrom + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [headlineFrom + 4, headlineFrom + 18], [`0px ${18 * scale}px`, "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Bon retour. <Bold>Marc</Bold> attend le devis, <Bold>Netflix</Bold> coûte plus cher et <Bold>1 tâche</Bold> est en retard.
      </div>

      {/* Meta */}
      <div
        style={{
          fontSize: 17 * scale,
          fontWeight: 600,
          color: COLORS.inkMuted,
          opacity: interpolate(frame, [headlineFrom + 14, headlineFrom + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <span style={{ color: COLORS.warning }}>3 requièrent votre attention</span> · 215 traités
      </div>

      {/* Attention cards */}
      {attentionFrom ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 * scale }}>
          {ATTENTION.map((item, i) => {
            const from = attentionFrom[i] ?? 0;
            const pressedAt = actionAt?.[i];
            const pressed = pressedAt !== undefined && frame >= pressedAt;
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10 * scale,
                  padding: `${13 * scale}px ${14 * scale}px`,
                  borderRadius: 22 * scale,
                  backgroundColor: "rgba(240,239,236,0.07)",
                  opacity: interpolate(frame, [from, from + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  translate: interpolate(frame, [from, from + 14], [`0px ${26 * scale}px`, "0px 0px"], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 * scale }}>
                <div
                  style={{
                    width: 42 * scale,
                    height: 42 * scale,
                    borderRadius: 13 * scale,
                    backgroundColor: pressed ? COLORS.success : "rgba(240,239,236,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Glyph name={pressed ? "check" : item.glyph} size={22 * scale} color={pressed ? "#06200f" : COLORS.ink} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 19 * scale, fontWeight: 700, lineHeight: 1.2 }}>{item.title}</div>
                  <div style={{ fontSize: 16 * scale, color: COLORS.inkMuted, marginTop: 2 * scale }}>{item.body}</div>
                </div>
                </div>
                <div
                  style={{
                    alignSelf: "flex-end",
                    fontSize: 15 * scale,
                    fontWeight: 800,
                    padding: `${8 * scale}px ${13 * scale}px`,
                    borderRadius: 999,
                    backgroundColor: pressed ? COLORS.success : COLORS.ink,
                    color: pressed ? "#06200f" : COLORS.surfaceRaised,
                    scale: `${pressedAt !== undefined ? interpolate(frame, [pressedAt - 3, pressedAt, pressedAt + 8], [1, 0.88, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1}`,
                  }}
                >
                  {pressed ? item.done : item.action}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Handled while away */}
      {handledFrom !== undefined && !compact ? (
        <div
          style={{
            borderRadius: 22 * scale,
            backgroundColor: "rgba(240,239,236,0.05)",
            padding: `${12 * scale}px ${14 * scale}px`,
            opacity: interpolate(frame, [handledFrom, handledFrom + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 * scale }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14 * scale, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.inkMuted }}>
                Pendant votre absence
              </div>
              <div style={{ fontSize: 16 * scale, fontWeight: 600, marginTop: 3 * scale, lineHeight: 1.25 }}>
                212 autres traités pendant votre sommeil
              </div>
            </div>
            <div style={{ flexShrink: 0, fontSize: 15 * scale, fontWeight: 700, color: COLORS.inkMuted }}>{handledOpen ? "Masquer" : "Afficher"}</div>
          </div>
          {handledOpen ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 * scale, marginTop: 12 * scale }}>
              {HANDLED.map((row, i) => {
                const from = (handledOpenFrom ?? 0) + 2 + i * 7;
                return (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10 * scale,
                      fontSize: 17 * scale,
                      fontWeight: 600,
                      opacity: interpolate(frame, [from, from + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                      translate: interpolate(frame, [from, from + 12], [`${-14 * scale}px 0px`, "0px 0px"], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      }),
                    }}
                  >
                    <div
                      style={{
                        width: 24 * scale,
                        height: 24 * scale,
                        borderRadius: "50%",
                        backgroundColor: COLORS.success,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Glyph name="check" size={14 * scale} color="#06200f" strokeWidth={3.6} />
                    </div>
                    {row.label}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

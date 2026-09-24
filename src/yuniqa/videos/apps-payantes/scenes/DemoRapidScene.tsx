import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY, WIDTH } from "@/yuniqa/brand";
import { Background } from "@/generic/components/backgrounds";
import { Captions } from "@/generic/components/text";
import { ChatBubble } from "@/generic/components/chat";
import { Glyph, type GlyphName } from "@/generic/components/icons";
import { PhoneFrame } from "@/generic/components/device";
import { Sfx } from "@/yuniqa/components";
import type { SfxKey } from "@/yuniqa/brand";
import { wordFrame, type SceneProps } from "@/generic/engine";

const PHONE_WIDTH = 640;

type Exchange = {
  needle: string;
  prompt: string;
  glyph: GlyphName;
  accent: string;
  result: string;
  detail: string;
  sfx: SfxKey;
};

const EXCHANGES: Exchange[] = [
  {
    needle: "previens",
    prompt: "Préviens-moi quand ce prix baisse",
    glyph: "bell",
    accent: COLORS.warning,
    result: "Prix suivi",
    detail: "AirPods Pro · alerte sous 249 €",
    sfx: "notification",
  },
  {
    needle: "ajoute",
    prompt: "Ajoute cette dépense",
    glyph: "budget",
    accent: COLORS.info,
    result: "Dépense ajoutée",
    detail: "12,40 € · Courses · budget OK",
    sfx: "success",
  },
  {
    needle: "planifie",
    prompt: "Planifie mes repas de la semaine",
    glyph: "meals",
    accent: COLORS.success,
    result: "7 dîners planifiés",
    detail: "Liste de courses prête",
    sfx: "pop",
  },
];

// Demo 2: three rapid-fire commands, each answered with a result card.
export const DemoRapidScene: React.FC<SceneProps> = ({ words }) => {
  const frame = useCurrentFrame();
  const chatWidth = PHONE_WIDTH - PHONE_WIDTH * 0.12;
  const starts = EXCHANGES.map((e, i) => wordFrame(words, e.needle, 10 + i * 40) - 4);

  return (
    <AbsoluteFill>
      <Background />
      {EXCHANGES.map((e, i) => (
        <Sfx key={e.needle} name={e.sfx} from={starts[i] + 16} />
      ))}
      <div style={{ position: "absolute", left: (WIDTH - PHONE_WIDTH) / 2, top: 230 }}>
        <PhoneFrame width={PHONE_WIDTH} title="Yuniqa">
          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 30 }}>
            {EXCHANGES.map((e, i) => (
              <div key={e.needle} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <ChatBubble role="user" from={starts[i]} width={chatWidth}>
                  {e.prompt}
                </ChatBubble>
                <ChatBubble role="assistant" from={starts[i] + 14} width={chatWidth}>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <div
                      style={{
                        width: chatWidth * 0.1,
                        height: chatWidth * 0.1,
                        borderRadius: 18,
                        backgroundColor: e.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        scale: interpolate(frame, [starts[i] + 16, starts[i] + 28], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                          easing: Easing.bezier(0.2, 1.4, 0.3, 1),
                          output: "perceptual-scale",
                        }),
                      }}
                    >
                      <Glyph name={e.glyph} size={chatWidth * 0.055} color="#0b0b0b" strokeWidth={2.8} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: chatWidth * 0.046 }}>{e.result}</div>
                      <div style={{ color: COLORS.inkMuted, fontSize: chatWidth * 0.034, marginTop: 4 }}>{e.detail}</div>
                    </div>
                  </div>
                </ChatBubble>
              </div>
            ))}
          </div>
        </PhoneFrame>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: 140,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 44,
          fontWeight: 600,
          color: COLORS.inkMuted,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        tu demandes · il fait
      </div>
      <Captions words={words} />
    </AbsoluteFill>
  );
};

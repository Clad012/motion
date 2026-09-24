export type GlyphName =
  | "tasks"
  | "notes"
  | "budget"
  | "meals"
  | "mail"
  | "ai"
  | "bell"
  | "check"
  | "moon"
  | "clock"
  | "camera"
  | "cross"
  | "flame";

type GlyphProps = {
  readonly name: GlyphName;
  readonly size: number;
  readonly color: string;
  readonly strokeWidth?: number;
};

// Minimal line icons, on-brand with the monochrome UI of the mobile app.
export const Glyph: React.FC<GlyphProps> = ({ name, size, color, strokeWidth = 2.2 }) => {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...common}>
      {name === "tasks" && (
        <>
          <path d="M4 6.5l1.8 1.8L9.5 4.5" />
          <path d="M12 6h8" />
          <path d="M4 13.5l1.8 1.8 3.7-3.8" />
          <path d="M12 13h8" />
          <path d="M12 20h8" />
        </>
      )}
      {name === "notes" && (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2.5" />
          <path d="M9 8h6M9 12h6M9 16h3" />
        </>
      )}
      {name === "budget" && (
        <>
          <rect x="3" y="6" width="18" height="13" rx="2.5" />
          <path d="M3 10h18" />
          <circle cx="16.5" cy="14.5" r="1.4" fill={color} stroke="none" />
        </>
      )}
      {name === "meals" && (
        <>
          <path d="M7 3v8M5 3v4a2 2 0 004 0V3M7 11v10" />
          <path d="M16 3c-2 0-3 2.5-3 5s1 4 3 4v9" />
        </>
      )}
      {name === "mail" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M3.5 7.5L12 13l8.5-5.5" />
        </>
      )}
      {name === "ai" && (
        <>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
          <path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
        </>
      )}
      {name === "bell" && (
        <>
          <path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z" />
          <path d="M10 20a2 2 0 004 0" />
        </>
      )}
      {name === "check" && <path d="M5 12.5l4.5 4.5L19 7" />}
      {name === "cross" && (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      )}
      {name === "clock" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </>
      )}
      {name === "camera" && (
        <>
          <path d="M3 8.5A2.5 2.5 0 015.5 6h1.7l1.2-2h6.2l1.2 2h1.7A2.5 2.5 0 0121 8.5v8A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5z" />
          <circle cx="12" cy="12.5" r="3.4" />
        </>
      )}
      {name === "flame" && (
        <>
          <path d="M12 3s5 4.2 5 8.5a5 5 0 01-10 0C7 9 9 7 9.8 5.8 10.6 7.3 12 8 12 8s-.6-2.6 0-5z" />
        </>
      )}
      {name === "moon" && <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />}
    </svg>
  );
};

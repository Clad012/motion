// Output format shared by every video: vertical 9:16, 30 fps.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Safe area for 1080x1920 (TikTok, Reels and Shorts UI covers the bottom ~300px and the right ~120px).
export const SAFE = {
  x: 90,
  top: 220,
  bottom: 420,
} as const;

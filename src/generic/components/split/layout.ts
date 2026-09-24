import { WIDTH } from "../../engine/format";

// Geometry shared by every split-screen video, tuned so both panels and the
// captions stay inside the TikTok safe area.
export const PANEL_LEFT = 84;
export const PANEL_WIDTH = WIDTH - PANEL_LEFT * 2;
export const PANEL_HEIGHT = 486;
export const TOP_PANEL_Y = 318;
export const BOTTOM_PANEL_Y = 828;
export const CAPTION_Y = 1436;
export const HEADER_Y = 180;

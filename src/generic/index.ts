import type { VideoEntry } from "./engine";
// @new-video-import
import { video as top5Prompts } from "./videos/top-5-prompts/video";
import { video as starter } from "./videos/starter/video";
import { video as phoneDemo } from "./videos/phone-demo/video";
import { video as splitCompare } from "./videos/split-compare/video";

// Brand-free template videos. Copy one to start a new video (see AGENTS.md).
export const GENERIC_VIDEOS: VideoEntry[] = [
  // @new-video-entry
  top5Prompts,
  starter,
  phoneDemo,
  splitCompare,
];

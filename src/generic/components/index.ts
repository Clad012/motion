// Every brand-agnostic component, in one import:
//   import { IPhone, ChatScreen, Captions, Sfx } from "@/generic/components";
// Layout constants that share a name (CAPTION_Y exists for both the close-up
// stage and the split screen) stay in their own folder: import them from
// "@/generic/components/device" or "@/generic/components/split".
export * from "./audio";
export * from "./backgrounds";
export * from "./cards";
export * from "./chat";
export * from "./icons";
export * from "./text";
export * from "./ui";
export * from "./voice";
export {
  IPhone,
  IPHONE_RATIO,
  SCREEN_HEIGHT_BASE,
  PhoneFrame,
  CloseUpStage,
  CLOSE_UP_CAPTION_Y,
  CLOSE_UP_SCREEN_SCALE,
} from "./device";
export { SplitStage, SplitPanel, BigStat, PanelRow, SeamBadge, type PanelSide, type SplitPanelProps } from "./split";

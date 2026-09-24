import type { ImageSet } from "../../scripts/images.mts";

// Prompts for `pnpm images --set=src/yuniqa/images.ts` (Gemini image generation).
// One shared look so every image belongs to the same world: photographic, low-key, charcoal.
const STYLE =
  "Photographic, editorial quality, low-key moody lighting, warm neutral palette, dark charcoal background, " +
  "shallow depth of field, no text, no watermark, no logo, no people's faces, 16:9 composition, centered subject.";

export const IMAGE_SET: ImageSet = {
  dir: "yuniqa/images",
  images: [
    // Rooms behind the phone in CloseUpStage.
    {
      name: "fond-bureau",
      prompt: `A warm wooden desk at night seen from above, notebook, coffee cup, soft lamp light, empty centre space, blurred background, cosy. ${STYLE}`,
    },
    {
      name: "fond-salon",
      prompt: `A cosy living room sofa corner in the evening, warm lamp, throw blanket, plant, empty centre space, blurred background. ${STYLE}`,
    },
  ],
};

import type { ImageSet } from "../../scripts/images.mts";

// Backgrounds for the generic templates: `pnpm images --set=src/generic/images.ts`.
const STYLE =
  "Photographic, editorial quality, soft low-key lighting, neutral palette, shallow depth of field, " +
  "empty centre space, no text, no watermark, no logo, no people, 16:9 composition.";

export const IMAGE_SET: ImageSet = {
  dir: "generic/images",
  images: [
    {
      name: "desk",
      prompt: `A calm wooden desk at dusk seen from above, notebook and coffee cup at the edges, warm lamp. ${STYLE}`,
    },
  ],
};

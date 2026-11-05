import type { GenerationReference } from "./GenerationReference.js";
import type { StaticAssetReference } from "./StaticAssetReference.js";
import type { InlineImageReference } from "./InlineImageReference.js";
export type ImageReference =
  | (GenerationReference & { type: "generation" })
  | (StaticAssetReference & { type: "asset" })
  | (InlineImageReference & { type: "inline_base64" });

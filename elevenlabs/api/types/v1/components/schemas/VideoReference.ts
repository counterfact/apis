import type { GenerationReference } from "./GenerationReference.js";
import type { StaticAssetReference } from "./StaticAssetReference.js";
import type { InlineVideoReference } from "./InlineVideoReference.js";
export type VideoReference =
  | (GenerationReference & { type: "generation" })
  | (StaticAssetReference & { type: "asset" })
  | (InlineVideoReference & { type: "inline_base64" });

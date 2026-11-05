import type { GenerationReference } from "./GenerationReference.js";
import type { StaticAssetReference } from "./StaticAssetReference.js";
import type { InlineAudioReference } from "./InlineAudioReference.js";
export type AudioReference =
  | (GenerationReference & { type: "generation" })
  | (StaticAssetReference & { type: "asset" })
  | (InlineAudioReference & { type: "inline_base64" });

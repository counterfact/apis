import type { GenerationReference } from "./GenerationReference.js";
import type { StaticAssetReference } from "./StaticAssetReference.js";
import type { VoiceReference } from "./VoiceReference.js";
import type { InlineBase64Reference } from "./InlineBase64Reference.js";
export type TemplateInputReference =
  | (GenerationReference & { type: "generation" })
  | (StaticAssetReference & { type: "asset" })
  | (VoiceReference & { type: "voice" })
  | (InlineBase64Reference & { type: "inline_base64" });

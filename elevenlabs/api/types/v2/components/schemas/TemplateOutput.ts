import type { TemplateImageOutput } from "./TemplateImageOutput.js";
import type { TemplateVideoOutput } from "./TemplateVideoOutput.js";
import type { TemplateAudioOutput } from "./TemplateAudioOutput.js";
import type { TemplateStringOutput } from "./TemplateStringOutput.js";
import type { TemplateIntegerOutput } from "./TemplateIntegerOutput.js";
import type { TemplateNumberOutput } from "./TemplateNumberOutput.js";
import type { TemplateBooleanOutput } from "./TemplateBooleanOutput.js";
import type { TemplateArrayOutput } from "./TemplateArrayOutput.js";
import type { TemplateObjectOutput } from "./TemplateObjectOutput.js";
/**
 * One output of a template run, discriminated on `type`: the `type` of the
 * port's `content_schema`. Check `status` for where it is in its lifecycle.
 */
export type TemplateOutput =
  | (TemplateImageOutput & { type: "image" })
  | (TemplateVideoOutput & { type: "video" })
  | (TemplateAudioOutput & { type: "audio" })
  | (TemplateStringOutput & { type: "string" })
  | (TemplateIntegerOutput & { type: "integer" })
  | (TemplateNumberOutput & { type: "number" })
  | (TemplateBooleanOutput & { type: "boolean" })
  | (TemplateArrayOutput & { type: "array" })
  | (TemplateObjectOutput & { type: "object" });

import type { WhatsAppTemplateTextParam } from "./WhatsAppTemplateTextParam.js";
import type { WhatsAppTemplateImageParam } from "./WhatsAppTemplateImageParam.js";
import type { WhatsAppTemplateDocumentParam } from "./WhatsAppTemplateDocumentParam.js";
import type { WhatsAppTemplateLocationParam } from "./WhatsAppTemplateLocationParam.js";
export type WhatsAppTemplateHeaderComponentParams = {
  /**
   * @default "header"
   */
  type?: "header";
  parameters: Array<
    | (WhatsAppTemplateTextParam & { type: "text" })
    | (WhatsAppTemplateImageParam & { type: "image" })
    | (WhatsAppTemplateDocumentParam & { type: "document" })
    | (WhatsAppTemplateLocationParam & { type: "location" })
  >;
};

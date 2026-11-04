import type { WhatsAppTemplateTextParam } from "./WhatsAppTemplateTextParam.js";
export type WhatsAppTemplateBodyComponentParams = {
  /**
   * @default "body"
   */
  type?: "body";
  parameters: Array<WhatsAppTemplateTextParam>;
};

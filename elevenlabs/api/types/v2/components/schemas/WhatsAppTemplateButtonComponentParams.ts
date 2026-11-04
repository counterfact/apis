import type { WhatsAppTemplateTextParam } from "./WhatsAppTemplateTextParam.js";
export type WhatsAppTemplateButtonComponentParams = {
  /**
   * @default "button"
   */
  type?: "button";
  parameters: Array<WhatsAppTemplateTextParam>;
  index: number;
  sub_type: string;
};

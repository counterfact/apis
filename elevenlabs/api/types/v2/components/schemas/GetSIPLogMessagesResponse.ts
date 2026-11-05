import type { SIPLogMessage } from "./SIPLogMessage.js";
export type GetSIPLogMessagesResponse = {
  sip_messages: Array<SIPLogMessage>;
  next_cursor?: string | null;
  /**
   * @default false
   */
  has_more?: boolean;
};

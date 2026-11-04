export type ExotelOutboundCallResponse = {
  success: boolean;
  message: string;
  conversation_id: string | null;
  /**
   * Exotel CallSid for the originated call
   */
  callSid: string | null;
};

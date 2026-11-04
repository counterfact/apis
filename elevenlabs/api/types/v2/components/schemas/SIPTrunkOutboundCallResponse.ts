export type SIPTrunkOutboundCallResponse = {
  success: boolean;
  message: string;
  conversation_id: string | null;
  sip_call_id: string | null;
};

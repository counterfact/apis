export type TwilioOutboundCallResponse = {
  success: boolean;
  message: string;
  conversation_id: string | null;
  callSid: string | null;
};

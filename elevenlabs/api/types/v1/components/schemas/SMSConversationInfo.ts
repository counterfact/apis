export type SMSConversationInfo = {
  direction: "inbound" | "outbound";
  phone_number_id?: string | null;
  sms_user_phone_number: string;
  agent_phone_number?: string | null;
};

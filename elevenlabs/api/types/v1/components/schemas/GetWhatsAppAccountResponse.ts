import type { WhatsAppAccountType } from "./WhatsAppAccountType.js";
export type GetWhatsAppAccountResponse = {
  business_account_id: string;
  phone_number_id: string;
  business_account_name: string;
  phone_number_name: string;
  phone_number: string;
  /**
   * Which Embedded Signup flow produced this account.
   * @default "cloud_api"
   */
  account_type?: WhatsAppAccountType;
  assigned_agent_id?: string | null;
  /**
   * @default true
   */
  enable_messaging?: boolean;
  /**
   * @default true
   */
  enable_audio_message_response?: boolean;
  /**
   * @default true
   */
  enable_typing_indicator?: boolean;
  assigned_agent_name: string | null;
  /**
   * @default false
   */
  is_token_expired?: boolean;
};

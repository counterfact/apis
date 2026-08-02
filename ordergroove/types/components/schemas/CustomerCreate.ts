export type CustomerCreate = {
  merchant: string;
  merchant_user_id: string;
  session_id: string;
  user_token_id: string;
  first_name: string;
  last_name: string;
  /**
   * @format email
   */
  email: string;
  phone_number: string;
  phone_type: number | "invalid" | "landline" | "mobile" | "voip";
  live: boolean;
  created: string;
  last_updated: string;
  last_login: string | null;
  extra_data?: string | null;
  locale: number | string;
  experiences?: string;
  price_code?: string;
};

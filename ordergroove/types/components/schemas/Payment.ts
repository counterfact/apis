/**
 * @example {"customer":"customer_demo","billing_address":"address_home","cc_number_ending":"1111","public_id":"payment_primary","label":"Primary","token_id":"simulator-token-primary","cc_holder":"Ada Example","cc_type":1,"cc_exp_date":"11/2028","payment_method":"credit card","live":true,"created":"2026-08-02 12:00:00","last_updated":"2026-08-02 12:00:00"}
 */
export type Payment = {
  customer: string;
  billing_address?: string | null;
  cc_number_ending: string | null;
  public_id: string;
  label?: string | null;
  token_id?: string | null;
  cc_holder?: string | null;
  cc_type?: number;
  cc_exp_date?: string;
  payment_method?:
    | "credit card"
    | "paypal"
    | "applepay"
    | "shoppay"
    | "googlepay";
  live: boolean;
  created: string;
  last_updated: string;
  [key: string]: unknown;
};

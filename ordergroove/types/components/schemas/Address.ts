/**
 * @example {"customer":"customer_demo","public_id":"address_home","label":"Home","first_name":"Ada","last_name":"Example","address":"1 Example Way","address2":"","city":"Exampleville","state_province_code":"NY","zip_postal_code":"10001","phone":"+15555550100","country_code":"US","live":true,"created":"2026-08-02 12:00:00","updated":"2026-08-02 12:00:00"}
 */
export type Address = {
  customer: string;
  public_id: string;
  label?: string | null;
  first_name: string;
  last_name: string;
  company_name?: string | null;
  address: string;
  address2?: string | null;
  city: string;
  state_province_code: string;
  zip_postal_code: string;
  phone?: string;
  fax?: string | null;
  country_code: string;
  live: boolean;
  created: string;
  updated: string;
  token_id?: string | null;
  store_public_id?: string | null;
  [key: string]: unknown;
};

export type marketplace_account = {
  /**
   * @format uri
   */
  url: string;
  id: number;
  type: string;
  node_id?: string;
  login: string;
  /**
   * @format email
   */
  email?: string;
  /**
   * @format email
   */
  organization_billing_email?: string;
};

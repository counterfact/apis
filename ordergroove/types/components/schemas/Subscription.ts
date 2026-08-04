export type Subscription = {
  customer: string;
  merchant: string;
  product: string;
  payment?: string | null;
  shipping_address?: string | null;
  offer?: string | null;
  subscription_type?: string;
  components?: Array<{ [key: string]: unknown }>;
  extra_data?: { [key: string]: unknown } | string | null;
  public_id: string;
  product_attribute?: string | null;
  quantity: number;
  price?: string | null;
  frequency_days: number;
  reminder_days?: number;
  every: number;
  /**
   * 1 days; 2 weeks; 3 months; 4 years.
   */
  every_period: 1 | 2 | 3 | 4;
  /**
   * @format date
   */
  start_date: string;
  cancelled?: string | null;
  cancel_reason?: string | null;
  cancel_reason_code?: string | null;
  iteration?: string | number | null;
  sequence?: string | number | null;
  session_id?: string | null;
  customer_rep?: string | null;
  club?: string | null;
  merchant_order_id?: string | null;
  created: string;
  updated: string;
  live: boolean;
  offer_profile_public_id?: string | null;
  prepaid_subscription_context?: { [key: string]: unknown };
  [key: string]: unknown;
};

/**
 * Marketplace Listing Plan
 */
export type marketplace_listing_plan = {
  /**
   * @format uri
   * @example "https://api.github.com/marketplace_listing/plans/1313"
   */
  url: string;
  /**
   * @format uri
   * @example "https://api.github.com/marketplace_listing/plans/1313/accounts"
   */
  accounts_url: string;
  /**
   * @example 1313
   */
  id: number;
  /**
   * @example 3
   */
  number: number;
  /**
   * @example "Pro"
   */
  name: string;
  /**
   * @example "A professional-grade CI solution"
   */
  description: string;
  /**
   * @example 1099
   */
  monthly_price_in_cents: number;
  /**
   * @example 11870
   */
  yearly_price_in_cents: number;
  /**
   * @example "FLAT_RATE"
   */
  price_model: "FREE" | "FLAT_RATE" | "PER_UNIT";
  /**
   * @example true
   */
  has_free_trial: boolean;
  unit_name: string;
  /**
   * @example "published"
   */
  state: string;
  /**
   * @example ["Up to 25 private repositories","11 concurrent builds"]
   */
  bullets: Array<string>;
};

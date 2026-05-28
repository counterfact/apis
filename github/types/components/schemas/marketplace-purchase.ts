import type { marketplace_listing_plan } from "./marketplace-listing-plan.js";

/**
 * Marketplace Purchase
 */
export type marketplace_purchase = {
  url: string;
  type: string;
  id: number;
  login: string;
  organization_billing_email?: string;
  email?: string;
  marketplace_pending_change?: {
    is_installed?: boolean;
    effective_date?: string;
    unit_count?: number;
    id?: number;
    plan?: marketplace_listing_plan;
  };
  marketplace_purchase: {
    billing_cycle?: string;
    next_billing_date?: string;
    is_installed?: boolean;
    unit_count?: number;
    on_free_trial?: boolean;
    free_trial_ends_on?: string;
    updated_at?: string;
    plan?: marketplace_listing_plan;
  };
};

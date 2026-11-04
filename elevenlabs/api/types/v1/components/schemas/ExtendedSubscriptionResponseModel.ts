import type { Currency } from "./Currency.js";
import type { Price } from "./Price.js";
import type { SubscriptionStatusType } from "./SubscriptionStatusType.js";
import type { BillingPeriod } from "./BillingPeriod.js";
import type { CharacterRefreshPeriod } from "./CharacterRefreshPeriod.js";
import type { InvoiceResponseModel } from "./InvoiceResponseModel.js";
import type { PendingSubscriptionSwitchResponseModel } from "./PendingSubscriptionSwitchResponseModel.js";
import type { PendingCancellationResponseModel } from "./PendingCancellationResponseModel.js";
/**
 * @example {"allowed_to_extend_character_limit":true,"billing_period":"monthly_period","can_extend_character_limit":true,"can_extend_voice_limit":true,"can_use_instant_voice_cloning":true,"can_use_professional_voice_cloning":true,"character_count":1000,"character_limit":10000,"character_refresh_period":"monthly_period","currency":"usd","current_overage":{"amount":"0","currency":"usd"},"has_open_invoices":true,"has_used_creator_coupon_on_account":false,"has_used_starter_coupon_on_account":false,"is_eligible_for_starter_promo":false,"max_character_limit_extension":10000,"max_credit_limit_extension":10000,"next_character_count_reset_unix":1738356858,"next_invoice":{"amount_due_cents":1000,"discounts":[{"discount_percent_off":20}],"next_payment_attempt_unix":1738356858,"payment_intent_status":"processing","payment_intent_statusses":["processing","succeeded"],"subtotal_cents":900,"tax_cents":100},"open_invoices":[{"amount_due_cents":1000,"discounts":[{"discount_percent_off":20}],"next_payment_attempt_unix":1738356858,"payment_intent_status":"processing","payment_intent_statusses":["processing","succeeded"],"subtotal_cents":900,"tax_cents":100}],"professional_voice_limit":1,"professional_voice_slots_used":0,"professional_voice_slots_used_in_workspace":0,"status":"active","tier":"starter","voice_add_edit_counter":0,"voice_limit":10,"voice_slots_used":1}
 */
export type ExtendedSubscriptionResponseModel = {
  /**
   * The tier of the user's subscription.
   */
  tier: string;
  /**
   * The number of characters used by the user.
   */
  character_count: number;
  /**
   * The maximum number of characters allowed in the current billing period.
   */
  character_limit: number;
  /**
   * Deprecated: use `max_credit_limit_extension`. Maximum number of characters that the character limit can be exceeded by. Managed by the workspace admin.
   */
  max_character_limit_extension: number | null;
  /**
   * Maximum number of credits that the credit limit can be exceeded by. Managed by the workspace admin. `"unlimited"` means no cap, `0` means usage-based billing is disabled.
   */
  max_credit_limit_extension: number | "unlimited";
  /**
   * Whether the workspace is entitled to enter overages (usage-based billing).
   */
  can_extend_character_limit: boolean;
  /**
   * Deprecated: use `max_credit_limit_extension != 0`. Whether the user is allowed to extend their character limit.
   */
  allowed_to_extend_character_limit: boolean;
  /**
   * The Unix timestamp of the next character count reset.
   */
  next_character_count_reset_unix?: number | null;
  /**
   * The number of voice slots used by the user.
   */
  voice_slots_used: number;
  /**
   * The number of professional voice slots used. For consolidated billing this is the group-wide count across all workspaces in the group; see professional_voice_slots_used_in_workspace for the current workspace only.
   */
  professional_voice_slots_used: number;
  /**
   * The number of professional voice slots used in the current workspace. For consolidated billing, professional_voice_slots_used counts across all workspaces in the group, while this counts only the current workspace.
   */
  professional_voice_slots_used_in_workspace: number;
  /**
   * The maximum number of voice slots allowed for the user.
   */
  voice_limit: number;
  /**
   * The maximum number of voice add/edits allowed for the user.
   */
  max_voice_add_edits?: number | null;
  /**
   * The number of voice add/edits used by the user.
   */
  voice_add_edit_counter: number;
  /**
   * The maximum number of professional voices allowed for the user.
   */
  professional_voice_limit: number;
  /**
   * Whether the user can extend their voice limit.
   */
  can_extend_voice_limit: boolean;
  /**
   * Whether the user can use instant voice cloning.
   */
  can_use_instant_voice_cloning: boolean;
  /**
   * Whether the user can use professional voice cloning.
   */
  can_use_professional_voice_cloning: boolean;
  /**
   * The currency of the user's subscription.
   */
  currency?: Currency | null;
  /**
   * The current usage-based overage cost.
   */
  current_overage: Price;
  /**
   * The status of the user's subscription.
   */
  status: SubscriptionStatusType;
  /**
   * The billing period of the user's subscription.
   */
  billing_period?: BillingPeriod | null;
  /**
   * The character refresh period of the user's subscription.
   */
  character_refresh_period?: CharacterRefreshPeriod | null;
  /**
   * The next invoice for the user.
   */
  next_invoice?: InvoiceResponseModel | null;
  /**
   * The open invoices for the user.
   */
  open_invoices: Array<InvoiceResponseModel>;
  /**
   * Whether the user has open invoices.
   */
  has_open_invoices: boolean;
  /**
   * The pending change for the user.
   */
  pending_change?:
    | PendingSubscriptionSwitchResponseModel
    | PendingCancellationResponseModel
    | null;
  /**
   * True if any workspace owned by this user's auth account has redeemed the starter first-month discount coupon.
   * @default false
   */
  has_used_starter_coupon_on_account?: boolean;
  /**
   * True if any workspace owned by this user's auth account has redeemed the creator first-month discount coupon.
   * @default false
   */
  has_used_creator_coupon_on_account?: boolean;
  /**
   * True if this user's auth account qualifies for the Starter first-month promo, using the same check as checkout. The starter_discount feature flag still decides whether the promo is offered.
   * @default false
   */
  is_eligible_for_starter_promo?: boolean;
};

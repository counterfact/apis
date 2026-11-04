import type { SubscriptionResponseModel } from "./SubscriptionResponseModel.js";
import type { SeatType } from "./SeatType.js";
/**
 * @example {"can_use_delayed_payment_methods":false,"created_at":1753999199,"first_name":"John","is_api_key_hashed":false,"is_new_user":false,"is_onboarding_checklist_completed":true,"is_onboarding_completed":true,"seat_type":"workspace_member","show_compliance_terms":false,"subscription":{"allowed_to_extend_character_limit":false,"billing_period":"monthly_period","can_extend_character_limit":false,"can_extend_voice_limit":false,"can_use_instant_voice_cloning":true,"can_use_professional_voice_cloning":true,"character_count":17231,"character_limit":100000,"character_refresh_period":"monthly_period","currency":"usd","current_overage":{"amount":"0","currency":"usd"},"max_character_limit_extension":10000,"max_credit_limit_extension":10000,"max_voice_add_edits":230,"next_character_count_reset_unix":1738356858,"professional_voice_limit":1,"professional_voice_slots_used":0,"professional_voice_slots_used_in_workspace":0,"status":"free","tier":"trial","voice_add_edit_counter":212,"voice_limit":120,"voice_slots_used":1},"user_id":"1234567890","workspace_id":"0987654321"}
 */
export type UserResponseModel = {
  /**
   * The unique identifier of the user.
   */
  user_id: string;
  /**
   * The unique identifier of the workspace this user's API key belongs to.
   */
  workspace_id: string;
  /**
   * Details of the user's subscription.
   */
  subscription: SubscriptionResponseModel;
  /**
   * Whether the user is new. This field is deprecated and will be removed in the future. Use 'created_at' instead.
   * @deprecated
   */
  is_new_user: boolean;
  /**
   * This field is deprecated and will be removed in a future major version. Instead use subscription.trust_on_invoice_creation.
   * @deprecated
   */
  can_use_delayed_payment_methods: boolean;
  /**
   * Whether the user's onboarding is completed.
   */
  is_onboarding_completed: boolean;
  /**
   * Whether the user's onboarding checklist is completed.
   */
  is_onboarding_checklist_completed: boolean;
  /**
   * Whether to show compliance terms (ToS, Privacy Policy, biometric consent) during onboarding. Set for users signing up from the marketing site.
   * @default false
   */
  show_compliance_terms?: boolean;
  /**
   * First name of the user.
   */
  first_name?: string | null;
  /**
   * Whether the user's API key is hashed.
   * @default false
   */
  is_api_key_hashed?: boolean;
  /**
   * The preview of the user's API key.
   */
  xi_api_key_preview?: string | null;
  /**
   * The referral link code of the user.
   */
  referral_link_code?: string | null;
  /**
   * The Partnerstack partner default link of the user.
   */
  partnerstack_partner_default_link?: string | null;
  /**
   * The unix timestamp of the user's creation. 0 if the user was created before the unix timestamp was added.
   */
  created_at: number;
  /**
   * The seat type of the user.
   */
  seat_type: SeatType;
};

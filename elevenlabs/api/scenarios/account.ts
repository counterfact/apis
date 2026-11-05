import type { Scenario } from "../types/index.js";

/** Synthetic account and quota values for client development. */
export const resetAccount: Scenario = ($) => {
  $.context.account = {
    profile: {
      user_id: "sim-user",
      workspace_id: "sim-workspace",
      first_name: "Simulator",
      created_at: 1_735_689_600,
      seat_type: "workspace_admin",
      is_new_user: false,
      can_use_delayed_payment_methods: false,
      is_onboarding_completed: true,
      is_onboarding_checklist_completed: true,
      show_compliance_terms: false,
      is_api_key_hashed: false,
    },
    subscription: {
      tier: "simulator",
      status: "active",
      character_count: 1000,
      character_limit: 10000,
      max_character_limit_extension: 0,
      max_credit_limit_extension: 0,
      can_extend_character_limit: false,
      allowed_to_extend_character_limit: false,
      next_character_count_reset_unix: 1_738_368_000,
      voice_slots_used: 0,
      voice_limit: 10,
      max_voice_add_edits: 100,
      voice_add_edit_counter: 0,
      professional_voice_slots_used: 0,
      professional_voice_slots_used_in_workspace: 0,
      professional_voice_limit: 0,
      can_extend_voice_limit: false,
      can_use_instant_voice_cloning: false,
      can_use_professional_voice_cloning: false,
      currency: "usd",
      current_overage: { amount: "0", currency: "usd" },
      billing_period: "monthly_period",
      character_refresh_period: "monthly_period",
      open_invoices: [],
      has_open_invoices: false,
      next_invoice: null,
      pending_change: null,
    },
  };
};

/** Show exhausted quota in account screens; this does not enforce billing. */
export const quotaExhausted: Scenario = ($) => {
  if (!$.context.account) throw new Error("Account state is not initialized; run startup or reset");
  $.context.account.subscription.character_count = $.context.account.subscription.character_limit;
};

import type { Scenario } from "../types/index.js";

export const emptyServiceAccounts: Scenario = ($) => {
  const context = $.loadContext("/service-accounts");
  context.accounts = new Map();
  context.nextAccountNumber = 0;
  context.nextKeyNumber = 0;
  context.nowUnix = 1_735_689_600;
  context.getGroups = () => $.loadContext("/workspace/groups").groups;
};
export const resetServiceAccounts: Scenario = ($) => {
  emptyServiceAccounts($);
  const context = $.loadContext("/service-accounts");
  context.accounts.set("sim-service-account", { id: "sim-service-account", name: "Simulator Worker", createdAt: context.nowUnix, sharing: [], keys: new Map([
    ["sim-service-key", { key_id: "sim-service-key", name: "Simulator Read Key", hint: "...fixture", service_account_user_id: "sim-service-account", created_at_unix: context.nowUnix,
      hashed_xi_api_key: "synthetic-fixture-hash", is_disabled: false, permissions: ["voices_read"], disable_reason: null, character_limit: 1000, character_count: 0,
      allowed_ips: null, third_party_disable_allowed: true, platform_limits: null, expires_at_unix: null }],
  ]) });
};

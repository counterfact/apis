import type { actions_enabled } from "./actions-enabled.js";
import type { allowed_actions } from "./allowed-actions.js";
import type { selected_actions_url } from "./selected-actions-url.js";
import type { sha_pinning_required } from "./sha-pinning-required.js";

export type actions_repository_permissions = {
  enabled: actions_enabled;
  allowed_actions?: allowed_actions;
  selected_actions_url?: selected_actions_url;
  sha_pinning_required?: sha_pinning_required;
};

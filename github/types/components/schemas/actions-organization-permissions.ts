import type { enabled_repositories } from "./enabled-repositories.js";
import type { allowed_actions } from "./allowed-actions.js";
import type { selected_actions_url } from "./selected-actions-url.js";
import type { sha_pinning_required } from "./sha-pinning-required.js";

export type actions_organization_permissions = {
  enabled_repositories: enabled_repositories;
  /**
   * The API URL to use to get or set the selected repositories that are allowed to run GitHub Actions, when `enabled_repositories` is set to `selected`.
   */
  selected_repositories_url?: string;
  allowed_actions?: allowed_actions;
  selected_actions_url?: selected_actions_url;
  sha_pinning_required?: sha_pinning_required;
};

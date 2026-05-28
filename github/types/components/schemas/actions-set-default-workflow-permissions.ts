import type { actions_default_workflow_permissions } from "./actions-default-workflow-permissions.js";
import type { actions_can_approve_pull_request_reviews } from "./actions-can-approve-pull-request-reviews.js";

export type actions_set_default_workflow_permissions = {
  default_workflow_permissions?: actions_default_workflow_permissions;
  can_approve_pull_request_reviews?: actions_can_approve_pull_request_reviews;
};

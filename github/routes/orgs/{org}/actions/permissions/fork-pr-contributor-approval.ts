import type { actionsGetForkPrContributorApprovalPermissionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/fork-pr-contributor-approval.types.js";
import type { actionsSetForkPrContributorApprovalPermissionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/fork-pr-contributor-approval.types.js";

export const GET: actionsGetForkPrContributorApprovalPermissionsOrganization =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: actionsSetForkPrContributorApprovalPermissionsOrganization =
  async ($) => {
    return $.response[204].empty();
  };

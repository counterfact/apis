import type { actionsGetForkPrContributorApprovalPermissionsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/fork-pr-contributor-approval.types.js";
import type { actionsSetForkPrContributorApprovalPermissionsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/fork-pr-contributor-approval.types.js";

export const GET: actionsGetForkPrContributorApprovalPermissionsRepository =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: actionsSetForkPrContributorApprovalPermissionsRepository =
  async ($) => {
    return $.response[204].empty();
  };

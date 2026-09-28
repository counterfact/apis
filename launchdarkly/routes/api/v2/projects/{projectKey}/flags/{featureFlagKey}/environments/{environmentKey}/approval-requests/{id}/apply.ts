import type { postApprovalRequestApplyForFlag } from "../../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/approval-requests/{id}/apply.types.js";

export const POST: postApprovalRequestApplyForFlag = async ($) => {
  return $.response[200].random();
};

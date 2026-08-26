import type { getApprovalsForFlag } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/approval-requests.types.js";
import type { postApprovalRequestForFlag } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/approval-requests.types.js";

export const GET: getApprovalsForFlag = async ($) => {
  return $.response[200].random();
};

export const POST: postApprovalRequestForFlag = async ($) => {
  return $.response[201].random();
};

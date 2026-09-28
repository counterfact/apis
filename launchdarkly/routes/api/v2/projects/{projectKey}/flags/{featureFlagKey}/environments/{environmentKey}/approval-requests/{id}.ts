import type { getApprovalForFlag } from "../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/approval-requests/{id}.types.js";
import type { deleteApprovalRequestForFlag } from "../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/approval-requests/{id}.types.js";

export const GET: getApprovalForFlag = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteApprovalRequestForFlag = async ($) => {
  return $.response[204].empty();
};

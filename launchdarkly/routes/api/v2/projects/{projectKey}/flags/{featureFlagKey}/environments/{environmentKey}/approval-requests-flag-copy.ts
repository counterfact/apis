import type { postFlagCopyConfigApprovalRequest } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/approval-requests-flag-copy.types.js";

export const POST: postFlagCopyConfigApprovalRequest = async ($) => {
  return $.response[201].random();
};

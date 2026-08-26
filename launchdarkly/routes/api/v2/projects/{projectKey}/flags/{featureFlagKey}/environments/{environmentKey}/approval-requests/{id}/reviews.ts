import type { postApprovalRequestReviewForFlag } from "../../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/approval-requests/{id}/reviews.types.js";

export const POST: postApprovalRequestReviewForFlag = async ($) => {
  return $.response[200].random();
};

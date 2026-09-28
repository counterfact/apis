import type { postApprovalRequestReview } from "../../../../../types/paths/api/v2/approval-requests/{id}/reviews.types.js";

export const POST: postApprovalRequestReview = async ($) => {
  return $.response[200].random();
};

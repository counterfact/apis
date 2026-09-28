import type { postApprovalRequestApply } from "../../../../../types/paths/api/v2/approval-requests/{id}/apply.types.js";

export const POST: postApprovalRequestApply = async ($) => {
  return $.response[200].random();
};

import type { getApprovalRequest } from "../../../../types/paths/api/v2/approval-requests/{id}.types.js";
import type { deleteApprovalRequest } from "../../../../types/paths/api/v2/approval-requests/{id}.types.js";

export const GET: getApprovalRequest = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteApprovalRequest = async ($) => {
  return $.response[204].empty();
};

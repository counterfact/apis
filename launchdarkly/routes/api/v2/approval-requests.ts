import type { getApprovalRequests } from "../../../types/paths/api/v2/approval-requests.types.js";
import type { postApprovalRequest } from "../../../types/paths/api/v2/approval-requests.types.js";

export const GET: getApprovalRequests = async ($) => {
  return $.response[200].random();
};

export const POST: postApprovalRequest = async ($) => {
  return $.response[201].random();
};

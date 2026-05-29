import type { copilotAddCopilotSeatsForUsers } from "../../../../../types/paths/orgs/{org}/copilot/billing/selected_users.types.js";
import type { copilotCancelCopilotSeatAssignmentForUsers } from "../../../../../types/paths/orgs/{org}/copilot/billing/selected_users.types.js";

export const POST: copilotAddCopilotSeatsForUsers = async ($) => {
  return $.response[201].random();
};

export const DELETE: copilotCancelCopilotSeatAssignmentForUsers = async ($) => {
  return $.response[200].random();
};

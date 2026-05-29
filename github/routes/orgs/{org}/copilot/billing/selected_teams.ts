import type { copilotAddCopilotSeatsForTeams } from "../../../../../types/paths/orgs/{org}/copilot/billing/selected_teams.types.js";
import type { copilotCancelCopilotSeatAssignmentForTeams } from "../../../../../types/paths/orgs/{org}/copilot/billing/selected_teams.types.js";

export const POST: copilotAddCopilotSeatsForTeams = async ($) => {
  return $.response[201].random();
};

export const DELETE: copilotCancelCopilotSeatAssignmentForTeams = async ($) => {
  return $.response[200].random();
};

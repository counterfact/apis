import type { copilotListCopilotSeats } from "../../../../../types/paths/orgs/{org}/copilot/billing/seats.types.js";

export const GET: copilotListCopilotSeats = async ($) => {
  return $.response[200].random();
};

import type { copilotGetCopilotSeatDetailsForUser } from "../../../../../types/paths/orgs/{org}/members/{username}/copilot.types.js";

export const GET: copilotGetCopilotSeatDetailsForUser = async ($) => {
  return $.response[200].random();
};

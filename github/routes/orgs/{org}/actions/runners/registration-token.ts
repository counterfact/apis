import type { actionsCreateRegistrationTokenForOrg } from "../../../../../types/paths/orgs/{org}/actions/runners/registration-token.types.js";

export const POST: actionsCreateRegistrationTokenForOrg = async ($) => {
  return $.response[201].random();
};

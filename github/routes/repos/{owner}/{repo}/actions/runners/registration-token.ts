import type { actionsCreateRegistrationTokenForRepo } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/registration-token.types.js";

export const POST: actionsCreateRegistrationTokenForRepo = async ($) => {
  return $.response[201].random();
};

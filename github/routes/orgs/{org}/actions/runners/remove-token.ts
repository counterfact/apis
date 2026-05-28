import type { actionsCreateRemoveTokenForOrg } from "../../../../../types/paths/orgs/{org}/actions/runners/remove-token.types.js";

export const POST: actionsCreateRemoveTokenForOrg = async ($) => {
  return $.response[201].random();
};

import type { actionsCreateRemoveTokenForRepo } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/remove-token.types.js";

export const POST: actionsCreateRemoveTokenForRepo = async ($) => {
  return $.response[201].random();
};

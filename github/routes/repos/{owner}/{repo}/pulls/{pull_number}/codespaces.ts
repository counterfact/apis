import type { codespacesCreateWithPrForAuthenticatedUser } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/codespaces.types.js";

export const POST: codespacesCreateWithPrForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};

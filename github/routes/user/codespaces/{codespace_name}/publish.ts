import type { codespacesPublishForAuthenticatedUser } from "../../../../types/paths/user/codespaces/{codespace_name}/publish.types.js";

export const POST: codespacesPublishForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};

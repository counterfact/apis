import type { codespacesStopForAuthenticatedUser } from "../../../../types/paths/user/codespaces/{codespace_name}/stop.types.js";

export const POST: codespacesStopForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

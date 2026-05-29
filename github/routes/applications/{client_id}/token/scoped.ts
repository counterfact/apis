import type { appsScopeToken } from "../../../../types/paths/applications/{client_id}/token/scoped.types.js";

export const POST: appsScopeToken = async ($) => {
  return $.response[200].random();
};

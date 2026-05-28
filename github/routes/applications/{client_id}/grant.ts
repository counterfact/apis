import type { appsDeleteAuthorization } from "../../../types/paths/applications/{client_id}/grant.types.js";

export const DELETE: appsDeleteAuthorization = async ($) => {
  return $.response[204].empty();
};

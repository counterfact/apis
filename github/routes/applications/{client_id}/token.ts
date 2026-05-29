import type { appsCheckToken } from "../../../types/paths/applications/{client_id}/token.types.js";
import type { appsResetToken } from "../../../types/paths/applications/{client_id}/token.types.js";
import type { appsDeleteToken } from "../../../types/paths/applications/{client_id}/token.types.js";

export const POST: appsCheckToken = async ($) => {
  return $.response[200].random();
};

export const PATCH: appsResetToken = async ($) => {
  return $.response[200].random();
};

export const DELETE: appsDeleteToken = async ($) => {
  return $.response[204].empty();
};

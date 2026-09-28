import type { getOAuthClientById } from "../../../../../types/paths/api/v2/oauth/clients/{clientId}.types.js";
import type { patchOAuthClient } from "../../../../../types/paths/api/v2/oauth/clients/{clientId}.types.js";
import type { deleteOAuthClient } from "../../../../../types/paths/api/v2/oauth/clients/{clientId}.types.js";

export const GET: getOAuthClientById = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchOAuthClient = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteOAuthClient = async ($) => {
  return $.response[204].empty();
};

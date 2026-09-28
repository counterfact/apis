import type { getRelayProxyConfig } from "../../../../../types/paths/api/v2/account/relay-auto-configs/{id}.types.js";
import type { patchRelayAutoConfig } from "../../../../../types/paths/api/v2/account/relay-auto-configs/{id}.types.js";
import type { deleteRelayAutoConfig } from "../../../../../types/paths/api/v2/account/relay-auto-configs/{id}.types.js";

export const GET: getRelayProxyConfig = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchRelayAutoConfig = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteRelayAutoConfig = async ($) => {
  return $.response[204].empty();
};

import type { getDestination } from "../../../../../../types/paths/api/v2/destinations/{projectKey}/{environmentKey}/{id}.types.js";
import type { patchDestination } from "../../../../../../types/paths/api/v2/destinations/{projectKey}/{environmentKey}/{id}.types.js";
import type { deleteDestination } from "../../../../../../types/paths/api/v2/destinations/{projectKey}/{environmentKey}/{id}.types.js";

export const GET: getDestination = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchDestination = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteDestination = async ($) => {
  return $.response[204].empty();
};

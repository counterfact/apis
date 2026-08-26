import type { getRepository } from "../../../../../types/paths/api/v2/code-refs/repositories/{repo}.types.js";
import type { patchRepository } from "../../../../../types/paths/api/v2/code-refs/repositories/{repo}.types.js";
import type { deleteRepository } from "../../../../../types/paths/api/v2/code-refs/repositories/{repo}.types.js";

export const GET: getRepository = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchRepository = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteRepository = async ($) => {
  return $.response[204].empty();
};

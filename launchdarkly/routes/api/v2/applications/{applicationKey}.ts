import type { getApplication } from "../../../../types/paths/api/v2/applications/{applicationKey}.types.js";
import type { patchApplication } from "../../../../types/paths/api/v2/applications/{applicationKey}.types.js";
import type { deleteApplication } from "../../../../types/paths/api/v2/applications/{applicationKey}.types.js";

export const GET: getApplication = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchApplication = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteApplication = async ($) => {
  return $.response[204].empty();
};

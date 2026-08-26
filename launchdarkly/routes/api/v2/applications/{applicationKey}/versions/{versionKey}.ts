import type { patchApplicationVersion } from "../../../../../../types/paths/api/v2/applications/{applicationKey}/versions/{versionKey}.types.js";
import type { deleteApplicationVersion } from "../../../../../../types/paths/api/v2/applications/{applicationKey}/versions/{versionKey}.types.js";

export const PATCH: patchApplicationVersion = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteApplicationVersion = async ($) => {
  return $.response[204].empty();
};

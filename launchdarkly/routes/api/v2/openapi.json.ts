import type { getOpenapiSpec } from "../../../types/paths/api/v2/openapi.json.types.js";

export const GET: getOpenapiSpec = async ($) => {
  return $.response[200].empty();
};

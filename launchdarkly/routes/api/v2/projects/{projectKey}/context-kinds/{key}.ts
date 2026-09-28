import type { putContextKind } from "../../../../../../types/paths/api/v2/projects/{projectKey}/context-kinds/{key}.types.js";

export const PUT: putContextKind = async ($) => {
  return $.response[200].random();
};

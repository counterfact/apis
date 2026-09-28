import type { getTags } from "../../../types/paths/api/v2/tags.types.js";

export const GET: getTags = async ($) => {
  return $.response[200].random();
};

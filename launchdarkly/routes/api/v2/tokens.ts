import type { getTokens } from "../../../types/paths/api/v2/tokens.types.js";
import type { postToken } from "../../../types/paths/api/v2/tokens.types.js";

export const GET: getTokens = async ($) => {
  return $.response[200].random();
};

export const POST: postToken = async ($) => {
  return $.response[201].random();
};

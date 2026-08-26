import type { resetToken } from "../../../../../types/paths/api/v2/tokens/{id}/reset.types.js";

export const POST: resetToken = async ($) => {
  return $.response[200].random();
};

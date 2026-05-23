import type { createUser } from "../types/paths/user.types.js";

export const POST: createUser = async ($) => {
  return $.response[200].random();
};

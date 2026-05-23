import type { createUsersWithListInput } from "../../types/paths/user/createWithList.types.js";

export const POST: createUsersWithListInput = async ($) => {
  return $.response[200].random();
};

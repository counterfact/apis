import type { loginUser } from "../../types/paths/user/login.types.js";

export const GET: loginUser = async ($) => {
  return $.response[200].random();
};

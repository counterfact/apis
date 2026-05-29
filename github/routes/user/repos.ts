import type { reposListForAuthenticatedUser } from "../../types/paths/user/repos.types.js";
import type { reposCreateForAuthenticatedUser } from "../../types/paths/user/repos.types.js";

export const GET: reposListForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};

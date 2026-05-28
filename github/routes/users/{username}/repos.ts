import type { reposListForUser } from "../../../types/paths/users/{username}/repos.types.js";

export const GET: reposListForUser = async ($) => {
  return $.response[200].random();
};

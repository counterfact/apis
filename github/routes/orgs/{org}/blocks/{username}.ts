import type { orgsCheckBlockedUser } from "../../../../types/paths/orgs/{org}/blocks/{username}.types.js";
import type { orgsBlockUser } from "../../../../types/paths/orgs/{org}/blocks/{username}.types.js";
import type { orgsUnblockUser } from "../../../../types/paths/orgs/{org}/blocks/{username}.types.js";

export const GET: orgsCheckBlockedUser = async ($) => {
  return $.response[204].empty();
};

export const PUT: orgsBlockUser = async ($) => {
  return $.response[204].empty();
};

export const DELETE: orgsUnblockUser = async ($) => {
  return $.response[204].empty();
};

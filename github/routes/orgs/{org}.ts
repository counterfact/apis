import type { orgsGet } from "../../types/paths/orgs/{org}.types.js";
import type { orgsUpdate } from "../../types/paths/orgs/{org}.types.js";
import type { orgsDelete } from "../../types/paths/orgs/{org}.types.js";

export const GET: orgsGet = async ($) => {
  return $.response[200].random();
};

export const PATCH: orgsUpdate = async ($) => {
  return $.response[200].random();
};

export const DELETE: orgsDelete = async ($) => {
  return $.response[202].empty();
};

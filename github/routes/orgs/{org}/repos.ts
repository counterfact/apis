import type { reposListForOrg } from "../../../types/paths/orgs/{org}/repos.types.js";
import type { reposCreateInOrg } from "../../../types/paths/orgs/{org}/repos.types.js";

export const GET: reposListForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateInOrg = async ($) => {
  return $.response[201].random();
};

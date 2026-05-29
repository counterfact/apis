import type { reposGetEnvironment } from "../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}.types.js";
import type { reposCreateOrUpdateEnvironment } from "../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}.types.js";
import type { reposDeleteAnEnvironment } from "../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}.types.js";

export const GET: reposGetEnvironment = async ($) => {
  return $.response[200].random();
};

export const PUT: reposCreateOrUpdateEnvironment = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteAnEnvironment = async ($) => {
  return $.response[204].empty();
};

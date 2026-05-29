import type { reposGetAllEnvironments } from "../../../../types/paths/repos/{owner}/{repo}/environments.types.js";

export const GET: reposGetAllEnvironments = async ($) => {
  return $.response[200].random();
};

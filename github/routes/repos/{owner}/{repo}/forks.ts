import type { reposListForks } from "../../../../types/paths/repos/{owner}/{repo}/forks.types.js";
import type { reposCreateFork } from "../../../../types/paths/repos/{owner}/{repo}/forks.types.js";

export const GET: reposListForks = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateFork = async ($) => {
  return $.response[202].random();
};

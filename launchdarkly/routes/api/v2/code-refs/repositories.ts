import type { getRepositories } from "../../../../types/paths/api/v2/code-refs/repositories.types.js";
import type { postRepository } from "../../../../types/paths/api/v2/code-refs/repositories.types.js";

export const GET: getRepositories = async ($) => {
  return $.response[200].random();
};

export const POST: postRepository = async ($) => {
  return $.response[200].random();
};

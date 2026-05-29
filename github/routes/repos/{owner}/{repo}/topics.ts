import type { reposGetAllTopics } from "../../../../types/paths/repos/{owner}/{repo}/topics.types.js";
import type { reposReplaceAllTopics } from "../../../../types/paths/repos/{owner}/{repo}/topics.types.js";

export const GET: reposGetAllTopics = async ($) => {
  return $.response[200].random();
};

export const PUT: reposReplaceAllTopics = async ($) => {
  return $.response[200].random();
};

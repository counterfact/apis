import type { reposGetWebhook } from "../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}.types.js";
import type { reposUpdateWebhook } from "../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}.types.js";
import type { reposDeleteWebhook } from "../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}.types.js";

export const GET: reposGetWebhook = async ($) => {
  return $.response[200].random();
};

export const PATCH: reposUpdateWebhook = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteWebhook = async ($) => {
  return $.response[204].empty();
};

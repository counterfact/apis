import type { reposGetWebhookConfigForRepo } from "../../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}/config.types.js";
import type { reposUpdateWebhookConfigForRepo } from "../../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}/config.types.js";

export const GET: reposGetWebhookConfigForRepo = async ($) => {
  return $.response[200].random();
};

export const PATCH: reposUpdateWebhookConfigForRepo = async ($) => {
  return $.response[200].random();
};

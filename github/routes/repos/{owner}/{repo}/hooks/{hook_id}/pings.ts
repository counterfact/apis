import type { reposPingWebhook } from "../../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}/pings.types.js";

export const POST: reposPingWebhook = async ($) => {
  return $.response[204].empty();
};

import type { reposTestPushWebhook } from "../../../../../../types/paths/repos/{owner}/{repo}/hooks/{hook_id}/tests.types.js";

export const POST: reposTestPushWebhook = async ($) => {
  return $.response[204].empty();
};

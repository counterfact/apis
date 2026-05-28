import type { reposListWebhooks } from "../../../../types/paths/repos/{owner}/{repo}/hooks.types.js";
import type { reposCreateWebhook } from "../../../../types/paths/repos/{owner}/{repo}/hooks.types.js";

export const GET: reposListWebhooks = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateWebhook = async ($) => {
  return $.response[201].random();
};

import type { orgsPingWebhook } from "../../../../../types/paths/orgs/{org}/hooks/{hook_id}/pings.types.js";

export const POST: orgsPingWebhook = async ($) => {
  return $.response[204].empty();
};

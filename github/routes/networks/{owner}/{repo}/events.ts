import type { activityListPublicEventsForRepoNetwork } from "../../../../types/paths/networks/{owner}/{repo}/events.types.js";

export const GET: activityListPublicEventsForRepoNetwork = async ($) => {
  return $.response[200].random();
};

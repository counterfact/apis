import type { activityGetRepoSubscription } from "../../../../types/paths/repos/{owner}/{repo}/subscription.types.js";
import type { activitySetRepoSubscription } from "../../../../types/paths/repos/{owner}/{repo}/subscription.types.js";
import type { activityDeleteRepoSubscription } from "../../../../types/paths/repos/{owner}/{repo}/subscription.types.js";

export const GET: activityGetRepoSubscription = async ($) => {
  return $.response[200].random();
};

export const PUT: activitySetRepoSubscription = async ($) => {
  return $.response[200].random();
};

export const DELETE: activityDeleteRepoSubscription = async ($) => {
  return $.response[204].empty();
};

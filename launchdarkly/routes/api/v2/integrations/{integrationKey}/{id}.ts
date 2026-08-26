import type { getSubscriptionByID } from "../../../../../types/paths/api/v2/integrations/{integrationKey}/{id}.types.js";
import type { updateSubscription } from "../../../../../types/paths/api/v2/integrations/{integrationKey}/{id}.types.js";
import type { deleteSubscription } from "../../../../../types/paths/api/v2/integrations/{integrationKey}/{id}.types.js";

export const GET: getSubscriptionByID = async ($) => {
  return $.response[200].random();
};

export const PATCH: updateSubscription = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteSubscription = async ($) => {
  return $.response[204].empty();
};

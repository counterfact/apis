import type { getSubscriptions } from "../../../../types/paths/api/v2/integrations/{integrationKey}.types.js";
import type { createSubscription } from "../../../../types/paths/api/v2/integrations/{integrationKey}.types.js";

export const GET: getSubscriptions = async ($) => {
  return $.response[200].random();
};

export const POST: createSubscription = async ($) => {
  return $.response[201].random();
};

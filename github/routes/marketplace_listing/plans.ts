import type { appsListPlans } from "../../types/paths/marketplace_listing/plans.types.js";

export const GET: appsListPlans = async ($) => {
  return $.response[200].random();
};

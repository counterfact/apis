import type { appsListPlansStubbed } from "../../../types/paths/marketplace_listing/stubbed/plans.types.js";

export const GET: appsListPlansStubbed = async ($) => {
  return $.response[200].random();
};

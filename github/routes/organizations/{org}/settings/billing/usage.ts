import type { billingGetGithubBillingUsageReportOrg } from "../../../../../types/paths/organizations/{org}/settings/billing/usage.types.js";

export const GET: billingGetGithubBillingUsageReportOrg = async ($) => {
  return $.response[200].empty();
};

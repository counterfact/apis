import type { billingGetGithubBillingUsageSummaryReportOrg } from "../../../../../../types/paths/organizations/{org}/settings/billing/usage/summary.types.js";

export const GET: billingGetGithubBillingUsageSummaryReportOrg = async ($) => {
  return $.response[200].empty();
};

import type { billingGetGithubBillingUsageSummaryReportUser } from "../../../../../../types/paths/users/{username}/settings/billing/usage/summary.types.js";

export const GET: billingGetGithubBillingUsageSummaryReportUser = async ($) => {
  return $.response[200].empty();
};

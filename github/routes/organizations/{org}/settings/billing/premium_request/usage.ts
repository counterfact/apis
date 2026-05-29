import type { billingGetGithubBillingPremiumRequestUsageReportOrg } from "../../../../../../types/paths/organizations/{org}/settings/billing/premium_request/usage.types.js";

export const GET: billingGetGithubBillingPremiumRequestUsageReportOrg = async (
  $,
) => {
  return $.response[200].empty();
};

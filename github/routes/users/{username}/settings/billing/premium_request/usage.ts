import type { billingGetGithubBillingPremiumRequestUsageReportUser } from "../../../../../../types/paths/users/{username}/settings/billing/premium_request/usage.types.js";

export const GET: billingGetGithubBillingPremiumRequestUsageReportUser = async (
  $,
) => {
  return $.response[200].empty();
};

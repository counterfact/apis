import type { billingGetGithubBillingUsageReportUser } from "../../../../../types/paths/users/{username}/settings/billing/usage.types.js";

export const GET: billingGetGithubBillingUsageReportUser = async ($) => {
  return $.response[200].empty();
};

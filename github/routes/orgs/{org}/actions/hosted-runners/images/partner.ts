import type { actionsGetHostedRunnersPartnerImagesForOrg } from "../../../../../../types/paths/orgs/{org}/actions/hosted-runners/images/partner.types.js";

export const GET: actionsGetHostedRunnersPartnerImagesForOrg = async ($) => {
  return $.response[200].random();
};

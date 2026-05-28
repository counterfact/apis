import type { campaignsListOrgCampaigns } from "../../../types/paths/orgs/{org}/campaigns.types.js";
import type { campaignsCreateCampaign } from "../../../types/paths/orgs/{org}/campaigns.types.js";

export const GET: campaignsListOrgCampaigns = async ($) => {
  return $.response[200].random();
};

export const POST: campaignsCreateCampaign = async ($) => {
  return $.response[200].random();
};

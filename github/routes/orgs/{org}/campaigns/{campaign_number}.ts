import type { campaignsGetCampaignSummary } from "../../../../types/paths/orgs/{org}/campaigns/{campaign_number}.types.js";
import type { campaignsUpdateCampaign } from "../../../../types/paths/orgs/{org}/campaigns/{campaign_number}.types.js";
import type { campaignsDeleteCampaign } from "../../../../types/paths/orgs/{org}/campaigns/{campaign_number}.types.js";

export const GET: campaignsGetCampaignSummary = async ($) => {
  return $.response[200].random();
};

export const PATCH: campaignsUpdateCampaign = async ($) => {
  return $.response[200].random();
};

export const DELETE: campaignsDeleteCampaign = async ($) => {
  return $.response[204].empty();
};

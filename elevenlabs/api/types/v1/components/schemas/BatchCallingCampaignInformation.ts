import type { CampaignConversationType } from "./CampaignConversationType.js";
export type BatchCallingCampaignInformation = {
  campaign_id: string;
  campaign_lead_id: string;
  cold_attempt?: number | null;
  conversation_type?: CampaignConversationType | null;
};

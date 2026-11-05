import type { BatchCallingCampaignInformation } from "./BatchCallingCampaignInformation.js";
export type ConversationHistoryBatchCallModel = {
  batch_call_id: string;
  batch_call_recipient_id: string;
  campaign?: BatchCallingCampaignInformation | null;
};

import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { RealtimeConversationGroupSharingSummary } from "./RealtimeConversationGroupSharingSummary.js";
export type RealtimeConversationGroupResponseModel = {
  id: string;
  title: string;
  description: string | null;
  access_info: ResourceAccessInfo;
  sharing: RealtimeConversationGroupSharingSummary;
  created_at_unix_secs: number;
};

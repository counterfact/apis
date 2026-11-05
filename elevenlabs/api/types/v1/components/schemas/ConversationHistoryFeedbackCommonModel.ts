import type { ConversationFeedbackType } from "./ConversationFeedbackType.js";
import type { UserFeedbackScore } from "./UserFeedbackScore.js";
export type ConversationHistoryFeedbackCommonModel = {
  type?: ConversationFeedbackType | null;
  overall_score?: UserFeedbackScore | null;
  /**
   * @default 0
   */
  likes?: number;
  /**
   * @default 0
   */
  dislikes?: number;
  rating?: number | null;
  comment?: string | null;
};

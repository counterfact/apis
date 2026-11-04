import type { UserFeedbackScore } from "./UserFeedbackScore.js";
export type ConversationFeedbackRequestModel = {
  /**
   * Either 'like' or 'dislike' to indicate the feedback for the conversation.
   */
  feedback?: UserFeedbackScore | null;
};

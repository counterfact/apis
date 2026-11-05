import type { UserFeedbackScore } from "./UserFeedbackScore.js";
export type UserFeedback = {
  score: UserFeedbackScore;
  time_in_call_secs: number;
};

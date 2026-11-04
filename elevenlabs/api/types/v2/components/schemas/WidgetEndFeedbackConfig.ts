import type { WidgetEndFeedbackType } from "./WidgetEndFeedbackType.js";
export type WidgetEndFeedbackConfig = {
  /**
   * The type of feedback to collect at the end of the conversation
   * @default "rating"
   */
  type?: WidgetEndFeedbackType;
};

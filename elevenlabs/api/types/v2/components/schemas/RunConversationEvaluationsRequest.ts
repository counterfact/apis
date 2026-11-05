import type { AnalysisScope } from "./AnalysisScope.js";
export type RunConversationEvaluationsRequest = {
  /**
   * ID of the single evaluation criterion to rerun.
   */
  evaluation_id: string;
  /**
   * @default "conversation"
   */
  scope?: AnalysisScope;
};

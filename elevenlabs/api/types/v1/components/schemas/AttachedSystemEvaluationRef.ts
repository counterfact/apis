import type { SystemEvaluationId } from "./SystemEvaluationId.js";
import type { AnalysisScope } from "./AnalysisScope.js";
export type AttachedSystemEvaluationRef = {
  source: "system";
  /**
   * Id of the referenced built-in system evaluation.
   */
  analysis_item_id: SystemEvaluationId;
  /**
   * Transcript context ('conversation' or 'agent') used when running this item.
   * @default "conversation"
   */
  scope?: AnalysisScope;
  /**
   * Optional relative weight for aggregate scoring.
   */
  weight?: number | null;
};

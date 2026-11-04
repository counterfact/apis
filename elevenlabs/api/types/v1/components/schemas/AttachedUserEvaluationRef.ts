import type { AnalysisScope } from "./AnalysisScope.js";
export type AttachedUserEvaluationRef = {
  source: "user";
  /**
   * Id of the referenced user evaluation item.
   */
  analysis_item_id: string;
  /**
   * Primary item version whose result feeds scoring. None tracks the item's latest published version.
   */
  version_id?: string | null;
  /**
   * Extra item versions to also run for comparison (A/B). These are executed and stored but excluded from scoring; the primary version_id is the one that scores.
   */
  additional_version_ids?: Array<string>;
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

import type { SystemDataCollectionId } from "./SystemDataCollectionId.js";
import type { AnalysisScope } from "./AnalysisScope.js";
export type AttachedSystemDataCollectionRef = {
  source: "system";
  /**
   * Id of the referenced built-in system data-collection item.
   */
  analysis_item_id: SystemDataCollectionId;
  /**
   * Transcript context ('conversation' or 'agent') used when running this item.
   * @default "conversation"
   */
  scope?: AnalysisScope;
};

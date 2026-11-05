import type { AnalysisScope } from "./AnalysisScope.js";
export type AttachedUserDataCollectionRef = {
  source: "user";
  /**
   * Id of the referenced user data-collection item.
   */
  analysis_item_id: string;
  /**
   * Pinned item version. None tracks the item's latest published version.
   */
  version_id?: string | null;
  /**
   * Transcript context ('conversation' or 'agent') used when running this item.
   * @default "conversation"
   */
  scope?: AnalysisScope;
};

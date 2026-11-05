import type { AnalysisItemVersionResponseModel } from "./AnalysisItemVersionResponseModel.js";
/**
 * Published versions, newest first; current_version_id is the main that unpinned refs resolve to.
 */
export type AnalysisItemVersionsResponseModel = {
  versions: Array<AnalysisItemVersionResponseModel>;
  current_version_id: string;
  next_cursor?: string | null;
  has_more: boolean;
};

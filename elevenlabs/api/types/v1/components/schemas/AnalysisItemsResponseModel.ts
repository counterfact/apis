import type { AnalysisItemResponseModel } from "./AnalysisItemResponseModel.js";
export type AnalysisItemsResponseModel = {
  analysis_items: Array<AnalysisItemResponseModel>;
  next_cursor?: string | null;
  has_more: boolean;
};

import type { HistoryAlignmentResponseModel } from "./HistoryAlignmentResponseModel.js";
export type HistoryAlignmentsResponseModel = {
  /**
   * The alignment of the text.
   */
  alignment: HistoryAlignmentResponseModel;
  /**
   * The normalized alignment of the text.
   */
  normalized_alignment: HistoryAlignmentResponseModel;
};

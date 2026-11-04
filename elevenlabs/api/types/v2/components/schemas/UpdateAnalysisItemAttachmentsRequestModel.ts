import type { AnalysisItemSource } from "./AnalysisItemSource.js";
import type { AnalysisItemAttachmentDestination } from "./AnalysisItemAttachmentDestination.js";
export type UpdateAnalysisItemAttachmentsRequestModel = {
  source: AnalysisItemSource;
  attach?: Array<AnalysisItemAttachmentDestination>;
  detach?: Array<AnalysisItemAttachmentDestination>;
};

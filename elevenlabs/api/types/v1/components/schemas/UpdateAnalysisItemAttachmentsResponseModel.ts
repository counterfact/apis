import type { BatchSuccessResponseModel_AnalysisItemAttachmentResultData_ } from "./BatchSuccessResponseModel_AnalysisItemAttachmentResultData_.js";
import type { BatchFailureResponseModel } from "./BatchFailureResponseModel.js";
export type UpdateAnalysisItemAttachmentsResponseModel = {
  results: Array<
    | (BatchSuccessResponseModel_AnalysisItemAttachmentResultData_ & {
        status: "success";
      })
    | (BatchFailureResponseModel & { status: "failure" })
  >;
};

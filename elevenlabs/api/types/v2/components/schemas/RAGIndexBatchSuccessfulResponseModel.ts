import type { RAGDocumentIndexResponseModel } from "./RAGDocumentIndexResponseModel.js";
export type RAGIndexBatchSuccessfulResponseModel = {
  /**
   * @default "success"
   */
  status: "success";
  data: RAGDocumentIndexResponseModel;
};

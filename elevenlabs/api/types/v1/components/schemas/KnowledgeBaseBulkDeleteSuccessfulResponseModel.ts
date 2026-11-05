import type { KnowledgeBaseDeletedResponseModel } from "./KnowledgeBaseDeletedResponseModel.js";
export type KnowledgeBaseBulkDeleteSuccessfulResponseModel = {
  /**
   * @default "success"
   */
  status: "success";
  data: KnowledgeBaseDeletedResponseModel;
};

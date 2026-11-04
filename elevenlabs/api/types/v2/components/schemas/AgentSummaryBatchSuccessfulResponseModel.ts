import type { AgentSummaryResponseModel } from "./AgentSummaryResponseModel.js";
export type AgentSummaryBatchSuccessfulResponseModel = {
  /**
   * @default "success"
   */
  status: "success";
  data: AgentSummaryResponseModel;
};

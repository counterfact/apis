import type { ListResponseMeta } from "./ListResponseMeta.js";
import type { TestInvocationSummaryResponseModel } from "./TestInvocationSummaryResponseModel.js";
export type GetTestInvocationsPageResponseModel = {
  /**
   * @default {}
   */
  meta?: ListResponseMeta;
  results: Array<TestInvocationSummaryResponseModel>;
  /**
   * Cursor for the next page of results
   */
  next_cursor?: string | null;
  /**
   * Whether there are more results available
   */
  has_more: boolean;
};

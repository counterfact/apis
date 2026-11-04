import type { BatchCallResponse } from "./BatchCallResponse.js";
export type WorkspaceBatchCallsResponse = {
  batch_calls: Array<BatchCallResponse>;
  /**
   * The next document, used to paginate through the batch calls
   */
  next_doc?: string | null;
  /**
   * Whether there are more batch calls to paginate through
   * @default false
   */
  has_more?: boolean;
};

import type { VoiceResponseModel } from "./VoiceResponseModel.js";
export type GetVoicesV2ResponseModel = {
  /**
   * The list of voices matching the query.
   */
  voices: Array<VoiceResponseModel>;
  /**
   * Indicates whether there are more voices available in subsequent pages. Use this flag (and next_page_token) for reliable pagination instead of relying on total_count.
   */
  has_more: boolean;
  /**
   * The total count of voices matching the query. This value is a live snapshot that reflects the current state of the database and may change between requests as users create, modify, or delete voices. For reliable pagination, use the has_more flag instead of relying on this value. Only request this field when you actually need the total count (e.g., for display purposes), as calculating it incurs a performance cost.
   */
  total_count: number;
  /**
   * Token to retrieve the next page of results. Pass this value to the next request to continue pagination. Null if there are no more results.
   */
  next_page_token?: string | null;
};

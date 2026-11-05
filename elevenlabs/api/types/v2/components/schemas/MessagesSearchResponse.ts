import type { ListResponseMeta } from "./ListResponseMeta.js";
import type { MessagesSearchResult } from "./MessagesSearchResult.js";
export type MessagesSearchResponse = {
  /**
   * @default {}
   */
  meta?: ListResponseMeta;
  results: Array<MessagesSearchResult>;
  /**
   * Cursor for the next page of results
   */
  next_cursor?: string | null;
  /**
   * Whether there are more results available
   */
  has_more: boolean;
};

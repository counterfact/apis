import type { search_result_text_matches } from "./search-result-text-matches.js";

/**
 * Label Search Result Item
 */
export type label_search_result_item = {
  id: number;
  node_id: string;
  /**
   * @format uri
   */
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
  score: number;
  text_matches?: search_result_text_matches;
};

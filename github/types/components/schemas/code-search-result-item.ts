import type { minimal_repository } from "./minimal-repository.js";
import type { search_result_text_matches } from "./search-result-text-matches.js";

/**
 * Code Search Result Item
 */
export type code_search_result_item = {
  name: string;
  path: string;
  sha: string;
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  git_url: string;
  /**
   * @format uri
   */
  html_url: string;
  repository: minimal_repository;
  score: number;
  file_size?: number;
  language?: string;
  /**
   * @format date-time
   */
  last_modified_at?: string;
  /**
   * @example ["73..77","77..78"]
   */
  line_numbers?: Array<string>;
  text_matches?: search_result_text_matches;
};

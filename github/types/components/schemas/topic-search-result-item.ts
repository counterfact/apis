import type { search_result_text_matches } from "./search-result-text-matches.js";

/**
 * Topic Search Result Item
 */
export type topic_search_result_item = {
  name: string;
  display_name: string;
  short_description: string;
  description: string;
  created_by: string;
  released: string;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  featured: boolean;
  curated: boolean;
  score: number;
  repository_count?: number;
  /**
   * @format uri
   */
  logo_url?: string;
  text_matches?: search_result_text_matches;
  related?: Array<{
    topic_relation?: {
      id?: number;
      name?: string;
      topic_id?: number;
      relation_type?: string;
    };
  }>;
  aliases?: Array<{
    topic_relation?: {
      id?: number;
      name?: string;
      topic_id?: number;
      relation_type?: string;
    };
  }>;
};

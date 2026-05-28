import type { search_result_text_matches } from "./search-result-text-matches.js";

/**
 * User Search Result Item
 */
export type user_search_result_item = {
  login: string;
  /**
   * @format int64
   */
  id: number;
  node_id: string;
  /**
   * @format uri
   */
  avatar_url: string;
  gravatar_id: string;
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  html_url: string;
  /**
   * @format uri
   */
  followers_url: string;
  /**
   * @format uri
   */
  subscriptions_url: string;
  /**
   * @format uri
   */
  organizations_url: string;
  /**
   * @format uri
   */
  repos_url: string;
  /**
   * @format uri
   */
  received_events_url: string;
  type: string;
  score: number;
  following_url: string;
  gists_url: string;
  starred_url: string;
  events_url: string;
  public_repos?: number;
  public_gists?: number;
  followers?: number;
  following?: number;
  /**
   * @format date-time
   */
  created_at?: string;
  /**
   * @format date-time
   */
  updated_at?: string;
  name?: string;
  bio?: string;
  /**
   * @format email
   */
  email?: string;
  location?: string;
  site_admin: boolean;
  hireable?: boolean;
  text_matches?: search_result_text_matches;
  blog?: string;
  company?: string;
  /**
   * @format date-time
   */
  suspended_at?: string;
  user_view_type?: string;
};

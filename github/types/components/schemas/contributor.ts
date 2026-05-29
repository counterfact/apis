/**
 * Contributor
 */
export type contributor = {
  login?: string;
  id?: number;
  node_id?: string;
  /**
   * @format uri
   */
  avatar_url?: string;
  gravatar_id?: string;
  /**
   * @format uri
   */
  url?: string;
  /**
   * @format uri
   */
  html_url?: string;
  /**
   * @format uri
   */
  followers_url?: string;
  following_url?: string;
  gists_url?: string;
  starred_url?: string;
  /**
   * @format uri
   */
  subscriptions_url?: string;
  /**
   * @format uri
   */
  organizations_url?: string;
  /**
   * @format uri
   */
  repos_url?: string;
  events_url?: string;
  /**
   * @format uri
   */
  received_events_url?: string;
  type: string;
  site_admin?: boolean;
  contributions: number;
  email?: string;
  name?: string;
  user_view_type?: string;
};

/**
 * Public User
 */
export type public_user = {
  login: string;
  /**
   * @format int64
   */
  id: number;
  user_view_type?: string;
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
  following_url: string;
  gists_url: string;
  starred_url: string;
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
  events_url: string;
  /**
   * @format uri
   */
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  /**
   * @format email
   */
  email: string;
  /**
   * @format email
   */
  notification_email?: string;
  hireable: boolean;
  bio: string;
  twitter_username?: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  plan?: {
    collaborators: number;
    name: string;
    space: number;
    private_repos: number;
  };
  /**
   * @example 1
   */
  private_gists?: number;
  /**
   * @example 2
   */
  total_private_repos?: number;
  /**
   * @example 2
   */
  owned_private_repos?: number;
  /**
   * @example 1
   */
  disk_usage?: number;
  /**
   * @example 3
   */
  collaborators?: number;
};

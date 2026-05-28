/**
 * Private User
 */
export type private_user = {
  /**
   * @example "octocat"
   */
  login: string;
  /**
   * @format int64
   * @example 1
   */
  id: number;
  user_view_type?: string;
  /**
   * @example "MDQ6VXNlcjE="
   */
  node_id: string;
  /**
   * @format uri
   * @example "https://github.com/images/error/octocat_happy.gif"
   */
  avatar_url: string;
  /**
   * @example "41d064eb2195891e12d0413f63227ea7"
   */
  gravatar_id: string;
  /**
   * @format uri
   * @example "https://api.github.com/users/octocat"
   */
  url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat"
   */
  html_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/users/octocat/followers"
   */
  followers_url: string;
  /**
   * @example "https://api.github.com/users/octocat/following{/other_user}"
   */
  following_url: string;
  /**
   * @example "https://api.github.com/users/octocat/gists{/gist_id}"
   */
  gists_url: string;
  /**
   * @example "https://api.github.com/users/octocat/starred{/owner}{/repo}"
   */
  starred_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/users/octocat/subscriptions"
   */
  subscriptions_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/users/octocat/orgs"
   */
  organizations_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/users/octocat/repos"
   */
  repos_url: string;
  /**
   * @example "https://api.github.com/users/octocat/events{/privacy}"
   */
  events_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/users/octocat/received_events"
   */
  received_events_url: string;
  /**
   * @example "User"
   */
  type: string;
  site_admin: boolean;
  /**
   * @example "monalisa octocat"
   */
  name: string;
  /**
   * @example "GitHub"
   */
  company: string;
  /**
   * @example "https://github.com/blog"
   */
  blog: string;
  /**
   * @example "San Francisco"
   */
  location: string;
  /**
   * @format email
   * @example "octocat@github.com"
   */
  email: string;
  /**
   * @format email
   * @example "octocat@github.com"
   */
  notification_email?: string;
  hireable: boolean;
  /**
   * @example "There once was..."
   */
  bio: string;
  /**
   * @example "monalisa"
   */
  twitter_username?: string;
  /**
   * @example 2
   */
  public_repos: number;
  /**
   * @example 1
   */
  public_gists: number;
  /**
   * @example 20
   */
  followers: number;
  /**
   * @example 0
   */
  following: number;
  /**
   * @format date-time
   * @example "2008-01-14T04:33:35Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2008-01-14T04:33:35Z"
   */
  updated_at: string;
  /**
   * @example 81
   */
  private_gists: number;
  /**
   * @example 100
   */
  total_private_repos: number;
  /**
   * @example 100
   */
  owned_private_repos: number;
  /**
   * @example 10000
   */
  disk_usage: number;
  /**
   * @example 8
   */
  collaborators: number;
  /**
   * @example true
   */
  two_factor_authentication: boolean;
  plan?: {
    collaborators: number;
    name: string;
    space: number;
    private_repos: number;
  };
  business_plus?: boolean;
  ldap_dn?: string;
};

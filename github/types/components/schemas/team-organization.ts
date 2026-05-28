/**
 * Team Organization
 */
export type team_organization = {
  /**
   * @example "github"
   */
  login: string;
  /**
   * @example 1
   */
  id: number;
  /**
   * @example "MDEyOk9yZ2FuaXphdGlvbjE="
   */
  node_id: string;
  /**
   * @format uri
   * @example "https://api.github.com/orgs/github"
   */
  url: string;
  /**
   * @format uri
   * @example "https://api.github.com/orgs/github/repos"
   */
  repos_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/orgs/github/events"
   */
  events_url: string;
  /**
   * @example "https://api.github.com/orgs/github/hooks"
   */
  hooks_url: string;
  /**
   * @example "https://api.github.com/orgs/github/issues"
   */
  issues_url: string;
  /**
   * @example "https://api.github.com/orgs/github/members{/member}"
   */
  members_url: string;
  /**
   * @example "https://api.github.com/orgs/github/public_members{/member}"
   */
  public_members_url: string;
  /**
   * @example "https://github.com/images/error/octocat_happy.gif"
   */
  avatar_url: string;
  /**
   * @example "A great organization"
   */
  description: string;
  /**
   * @example "github"
   */
  name?: string;
  /**
   * @example "GitHub"
   */
  company?: string;
  /**
   * @format uri
   * @example "https://github.com/blog"
   */
  blog?: string;
  /**
   * @example "San Francisco"
   */
  location?: string;
  /**
   * @format email
   * @example "octocat@github.com"
   */
  email?: string;
  /**
   * @example "github"
   */
  twitter_username?: string;
  /**
   * @example true
   */
  is_verified?: boolean;
  /**
   * @example true
   */
  has_organization_projects: boolean;
  /**
   * @example true
   */
  has_repository_projects: boolean;
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
   * @format uri
   * @example "https://github.com/octocat"
   */
  html_url: string;
  /**
   * @format date-time
   * @example "2008-01-14T04:33:35Z"
   */
  created_at: string;
  /**
   * @example "Organization"
   */
  type: string;
  /**
   * @example 100
   */
  total_private_repos?: number;
  /**
   * @example 100
   */
  owned_private_repos?: number;
  /**
   * @example 81
   */
  private_gists?: number;
  /**
   * @example 10000
   */
  disk_usage?: number;
  /**
   * @example 8
   */
  collaborators?: number;
  /**
   * @format email
   * @example "org@example.com"
   */
  billing_email?: string;
  plan?: {
    name: string;
    space: number;
    private_repos: number;
    filled_seats?: number;
    seats?: number;
  };
  default_repository_permission?: string;
  /**
   * @example true
   */
  members_can_create_repositories?: boolean;
  /**
   * @example true
   */
  two_factor_requirement_enabled?: boolean;
  /**
   * @example "all"
   */
  members_allowed_repository_creation_type?: string;
  /**
   * @example true
   */
  members_can_create_public_repositories?: boolean;
  /**
   * @example true
   */
  members_can_create_private_repositories?: boolean;
  /**
   * @example true
   */
  members_can_create_internal_repositories?: boolean;
  /**
   * @example true
   */
  members_can_create_pages?: boolean;
  /**
   * @example true
   */
  members_can_create_public_pages?: boolean;
  /**
   * @example true
   */
  members_can_create_private_pages?: boolean;
  /**
   * @example false
   */
  members_can_fork_private_repositories?: boolean;
  /**
   * @example false
   */
  web_commit_signoff_required?: boolean;
  /**
   * @format date-time
   */
  updated_at: string;
  /**
   * @format date-time
   */
  archived_at: string;
};

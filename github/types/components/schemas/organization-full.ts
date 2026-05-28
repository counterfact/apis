/**
 * Organization Full
 */
export type organization_full = {
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
   * The number of collaborators on private repositories.
   *
   * This field may be null if the number of private repositories is over 50,000.
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
   * The default branch for repositories created in this organization.
   * @example "main"
   */
  default_repository_branch?: string;
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
   * @example true
   */
  members_can_delete_repositories?: boolean;
  /**
   * @example true
   */
  members_can_change_repo_visibility?: boolean;
  /**
   * @example true
   */
  members_can_invite_outside_collaborators?: boolean;
  /**
   * @example true
   */
  members_can_delete_issues?: boolean;
  /**
   * @example true
   */
  display_commenter_full_name_setting_enabled?: boolean;
  /**
   * @example true
   */
  readers_can_create_discussions?: boolean;
  /**
   * @example true
   */
  members_can_create_teams?: boolean;
  /**
   * @example true
   */
  members_can_view_dependency_insights?: boolean;
  /**
   * @example false
   */
  members_can_fork_private_repositories?: boolean;
  /**
   * @example false
   */
  web_commit_signoff_required?: boolean;
  /**
   * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
   *
   * Whether GitHub Advanced Security is enabled for new repositories and repositories transferred to this organization.
   *
   * This field is only visible to organization owners or members of a team with the security manager role.
   * @example false
   * @deprecated
   */
  advanced_security_enabled_for_new_repositories?: boolean;
  /**
   * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
   *
   * Whether Dependabot alerts are automatically enabled for new repositories and repositories transferred to this organization.
   *
   * This field is only visible to organization owners or members of a team with the security manager role.
   * @example false
   * @deprecated
   */
  dependabot_alerts_enabled_for_new_repositories?: boolean;
  /**
   * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
   *
   * Whether Dependabot security updates are automatically enabled for new repositories and repositories transferred to this organization.
   *
   * This field is only visible to organization owners or members of a team with the security manager role.
   * @example false
   * @deprecated
   */
  dependabot_security_updates_enabled_for_new_repositories?: boolean;
  /**
   * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
   *
   * Whether dependency graph is automatically enabled for new repositories and repositories transferred to this organization.
   *
   * This field is only visible to organization owners or members of a team with the security manager role.
   * @example false
   * @deprecated
   */
  dependency_graph_enabled_for_new_repositories?: boolean;
  /**
   * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
   *
   * Whether secret scanning is automatically enabled for new repositories and repositories transferred to this organization.
   *
   * This field is only visible to organization owners or members of a team with the security manager role.
   * @example false
   * @deprecated
   */
  secret_scanning_enabled_for_new_repositories?: boolean;
  /**
   * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
   *
   * Whether secret scanning push protection is automatically enabled for new repositories and repositories transferred to this organization.
   *
   * This field is only visible to organization owners or members of a team with the security manager role.
   * @example false
   * @deprecated
   */
  secret_scanning_push_protection_enabled_for_new_repositories?: boolean;
  /**
   * Whether a custom link is shown to contributors who are blocked from pushing a secret by push protection.
   * @example false
   */
  secret_scanning_push_protection_custom_link_enabled?: boolean;
  /**
   * An optional URL string to display to contributors who are blocked from pushing a secret.
   * @example "https://github.com/test-org/test-repo/blob/main/README.md"
   */
  secret_scanning_push_protection_custom_link?: string;
  /**
   * @format date-time
   * @example "2008-01-14T04:33:35Z"
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  /**
   * @format date-time
   */
  archived_at: string;
  /**
   * Controls whether or not deploy keys may be added and used for repositories in the organization.
   * @example false
   */
  deploy_keys_enabled_for_repositories?: boolean;
};

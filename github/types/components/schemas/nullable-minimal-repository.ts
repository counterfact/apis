import type { simple_user } from "./simple-user.js";
import type { code_of_conduct } from "./code-of-conduct.js";
import type { security_and_analysis } from "./security-and-analysis.js";

/**
 * Minimal Repository
 */
export type nullable_minimal_repository = {
  /**
   * @format int64
   * @example 1296269
   */
  id: number;
  /**
   * @example "MDEwOlJlcG9zaXRvcnkxMjk2MjY5"
   */
  node_id: string;
  /**
   * @example "Hello-World"
   */
  name: string;
  /**
   * @example "octocat/Hello-World"
   */
  full_name: string;
  owner: simple_user;
  private: boolean;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World"
   */
  html_url: string;
  /**
   * @example "This your first repo!"
   */
  description: string;
  fork: boolean;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World"
   */
  url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}"
   */
  archive_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/assignees{/user}"
   */
  assignees_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}"
   */
  blobs_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/branches{/branch}"
   */
  branches_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}"
   */
  collaborators_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/comments{/number}"
   */
  comments_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/commits{/sha}"
   */
  commits_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}"
   */
  compare_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/contents/{+path}"
   */
  contents_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/contributors"
   */
  contributors_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/deployments"
   */
  deployments_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/downloads"
   */
  downloads_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/events"
   */
  events_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/forks"
   */
  forks_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}"
   */
  git_commits_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}"
   */
  git_refs_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}"
   */
  git_tags_url: string;
  git_url?: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}"
   */
  issue_comment_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/issues/events{/number}"
   */
  issue_events_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/issues{/number}"
   */
  issues_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/keys{/key_id}"
   */
  keys_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/labels{/name}"
   */
  labels_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/languages"
   */
  languages_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/merges"
   */
  merges_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/milestones{/number}"
   */
  milestones_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}"
   */
  notifications_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/pulls{/number}"
   */
  pulls_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/releases{/id}"
   */
  releases_url: string;
  ssh_url?: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/stargazers"
   */
  stargazers_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/statuses/{sha}"
   */
  statuses_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/subscribers"
   */
  subscribers_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/subscription"
   */
  subscription_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/tags"
   */
  tags_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/teams"
   */
  teams_url: string;
  /**
   * @example "http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}"
   */
  trees_url: string;
  clone_url?: string;
  mirror_url?: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/hooks"
   */
  hooks_url: string;
  svn_url?: string;
  homepage?: string;
  language?: string;
  forks_count?: number;
  stargazers_count?: number;
  watchers_count?: number;
  /**
   * The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
   */
  size?: number;
  default_branch?: string;
  open_issues_count?: number;
  is_template?: boolean;
  topics?: Array<string>;
  has_issues?: boolean;
  has_projects?: boolean;
  has_wiki?: boolean;
  has_pages?: boolean;
  has_downloads?: boolean;
  has_discussions?: boolean;
  has_pull_requests?: boolean;
  /**
   * The policy controlling who can create pull requests: all or collaborators_only.
   */
  pull_request_creation_policy?: "all" | "collaborators_only";
  archived?: boolean;
  disabled?: boolean;
  visibility?: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:06:43Z"
   */
  pushed_at?: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:01:12Z"
   */
  created_at?: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:14:43Z"
   */
  updated_at?: string;
  permissions?: {
    admin?: boolean;
    maintain?: boolean;
    push?: boolean;
    triage?: boolean;
    pull?: boolean;
  };
  /**
   * @example "admin"
   */
  role_name?: string;
  temp_clone_token?: string;
  delete_branch_on_merge?: boolean;
  subscribers_count?: number;
  network_count?: number;
  code_of_conduct?: code_of_conduct;
  license?: {
    key?: string;
    name?: string;
    spdx_id?: string;
    url?: string;
    node_id?: string;
  };
  /**
   * @example 0
   */
  forks?: number;
  /**
   * @example 0
   */
  open_issues?: number;
  /**
   * @example 0
   */
  watchers?: number;
  allow_forking?: boolean;
  /**
   * @example false
   */
  web_commit_signoff_required?: boolean;
  security_and_analysis?: security_and_analysis;
  /**
   * The custom properties that were defined for the repository. The keys are the custom property names, and the values are the corresponding custom property values.
   */
  custom_properties?: { [key: string]: unknown };
};

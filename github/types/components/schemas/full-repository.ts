import type { simple_user } from "./simple-user.js";
import type { nullable_repository } from "./nullable-repository.js";
import type { nullable_license_simple } from "./nullable-license-simple.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { repository } from "./repository.js";
import type { code_of_conduct_simple } from "./code-of-conduct-simple.js";
import type { security_and_analysis } from "./security-and-analysis.js";

/**
 * Full Repository
 */
export type full_repository = {
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
  /**
   * @example "git:github.com/octocat/Hello-World.git"
   */
  git_url: string;
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
  /**
   * @example "git@github.com:octocat/Hello-World.git"
   */
  ssh_url: string;
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
  /**
   * @example "https://github.com/octocat/Hello-World.git"
   */
  clone_url: string;
  /**
   * @format uri
   * @example "git:git.example.com/octocat/Hello-World"
   */
  mirror_url: string;
  /**
   * @format uri
   * @example "http://api.github.com/repos/octocat/Hello-World/hooks"
   */
  hooks_url: string;
  /**
   * @format uri
   * @example "https://svn.github.com/octocat/Hello-World"
   */
  svn_url: string;
  /**
   * @format uri
   * @example "https://github.com"
   */
  homepage: string;
  language: string;
  /**
   * @example 9
   */
  forks_count: number;
  /**
   * @example 80
   */
  stargazers_count: number;
  /**
   * @example 80
   */
  watchers_count: number;
  /**
   * The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
   * @example 108
   */
  size: number;
  /**
   * @example "master"
   */
  default_branch: string;
  /**
   * @example 0
   */
  open_issues_count: number;
  /**
   * @example true
   */
  is_template?: boolean;
  /**
   * @example ["octocat","atom","electron","API"]
   */
  topics?: Array<string>;
  /**
   * @example true
   */
  has_issues: boolean;
  /**
   * @example true
   */
  has_projects: boolean;
  /**
   * @example true
   */
  has_wiki: boolean;
  has_pages: boolean;
  /**
   * @example true
   */
  has_downloads?: boolean;
  /**
   * @example true
   */
  has_discussions: boolean;
  /**
   * @example true
   */
  has_pull_requests?: boolean;
  /**
   * The policy controlling who can create pull requests: all or collaborators_only.
   * @example "all"
   */
  pull_request_creation_policy?: "all" | "collaborators_only";
  archived: boolean;
  /**
   * Returns whether or not this repository disabled.
   */
  disabled: boolean;
  /**
   * The repository visibility: public, private, or internal.
   * @example "public"
   */
  visibility?: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:06:43Z"
   */
  pushed_at: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:01:12Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2011-01-26T19:14:43Z"
   */
  updated_at: string;
  permissions?: {
    admin: boolean;
    maintain?: boolean;
    push: boolean;
    triage?: boolean;
    pull: boolean;
  };
  /**
   * @example true
   */
  allow_rebase_merge?: boolean;
  template_repository?: nullable_repository;
  temp_clone_token?: string;
  /**
   * @example true
   */
  allow_squash_merge?: boolean;
  /**
   * @example false
   */
  allow_auto_merge?: boolean;
  /**
   * @example false
   */
  delete_branch_on_merge?: boolean;
  /**
   * @example true
   */
  allow_merge_commit?: boolean;
  /**
   * @example true
   */
  allow_update_branch?: boolean;
  /**
   * @example false
   */
  use_squash_pr_title_as_default?: boolean;
  /**
   * The default value for a squash merge commit title:
   *
   * - `PR_TITLE` - default to the pull request's title.
   * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
   * @example "PR_TITLE"
   */
  squash_merge_commit_title?: "PR_TITLE" | "COMMIT_OR_PR_TITLE";
  /**
   * The default value for a squash merge commit message:
   *
   * - `PR_BODY` - default to the pull request's body.
   * - `COMMIT_MESSAGES` - default to the branch's commit messages.
   * - `BLANK` - default to a blank commit message.
   * @example "PR_BODY"
   */
  squash_merge_commit_message?: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK";
  /**
   * The default value for a merge commit title.
   *
   *   - `PR_TITLE` - default to the pull request's title.
   *   - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
   * @example "PR_TITLE"
   */
  merge_commit_title?: "PR_TITLE" | "MERGE_MESSAGE";
  /**
   * The default value for a merge commit message.
   *
   * - `PR_TITLE` - default to the pull request's title.
   * - `PR_BODY` - default to the pull request's body.
   * - `BLANK` - default to a blank commit message.
   * @example "PR_BODY"
   */
  merge_commit_message?: "PR_BODY" | "PR_TITLE" | "BLANK";
  /**
   * @example true
   */
  allow_forking?: boolean;
  /**
   * @example false
   */
  web_commit_signoff_required?: boolean;
  /**
   * @example 42
   */
  subscribers_count: number;
  /**
   * @example 0
   */
  network_count: number;
  license: nullable_license_simple;
  organization?: nullable_simple_user;
  parent?: repository;
  source?: repository;
  forks: number;
  master_branch?: string;
  open_issues: number;
  watchers: number;
  /**
   * Whether anonymous git access is allowed.
   * @default true
   */
  anonymous_access_enabled?: boolean;
  code_of_conduct?: code_of_conduct_simple;
  security_and_analysis?: security_and_analysis;
  /**
   * The custom properties that were defined for the repository. The keys are the custom property names, and the values are the corresponding custom property values.
   */
  custom_properties?: { [key: string]: unknown };
};

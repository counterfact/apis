import type { nullable_license_simple } from "./nullable-license-simple.js";
import type { simple_user } from "./simple-user.js";

/**
 * A repository on GitHub.
 */
export type repository = {
  /**
   * Unique identifier of the repository
   * @format int64
   * @example 42
   */
  id: number;
  /**
   * @example "MDEwOlJlcG9zaXRvcnkxMjk2MjY5"
   */
  node_id: string;
  /**
   * The name of the repository.
   * @example "Team Environment"
   */
  name: string;
  /**
   * @example "octocat/Hello-World"
   */
  full_name: string;
  license: nullable_license_simple;
  forks: number;
  permissions?: {
    admin: boolean;
    pull: boolean;
    triage?: boolean;
    push: boolean;
    maintain?: boolean;
  };
  owner: simple_user;
  /**
   * Whether the repository is private or public.
   * @default false
   */
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
   * The default branch of the repository.
   * @example "master"
   */
  default_branch: string;
  /**
   * @example 0
   */
  open_issues_count: number;
  /**
   * Whether this repository acts as a template that can be used to generate new repositories.
   * @default false
   * @example true
   */
  is_template?: boolean;
  topics?: Array<string>;
  /**
   * Whether issues are enabled.
   * @default true
   * @example true
   */
  has_issues: boolean;
  /**
   * Whether projects are enabled.
   * @default true
   * @example true
   */
  has_projects: boolean;
  /**
   * Whether the wiki is enabled.
   * @default true
   * @example true
   */
  has_wiki: boolean;
  has_pages: boolean;
  /**
   * Whether downloads are enabled.
   * @default true
   * @example true
   * @deprecated
   */
  has_downloads: boolean;
  /**
   * Whether discussions are enabled.
   * @default false
   * @example true
   */
  has_discussions?: boolean;
  /**
   * Whether pull requests are enabled.
   * @default true
   * @example true
   */
  has_pull_requests?: boolean;
  /**
   * The policy controlling who can create pull requests: all or collaborators_only.
   * @example "all"
   */
  pull_request_creation_policy?: "all" | "collaborators_only";
  /**
   * Whether the repository is archived.
   * @default false
   */
  archived: boolean;
  /**
   * Returns whether or not this repository disabled.
   */
  disabled: boolean;
  /**
   * The repository visibility: public, private, or internal.
   * @default "public"
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
  /**
   * Whether to allow rebase merges for pull requests.
   * @default true
   * @example true
   */
  allow_rebase_merge?: boolean;
  temp_clone_token?: string;
  /**
   * Whether to allow squash merges for pull requests.
   * @default true
   * @example true
   */
  allow_squash_merge?: boolean;
  /**
   * Whether to allow Auto-merge to be used on pull requests.
   * @default false
   * @example false
   */
  allow_auto_merge?: boolean;
  /**
   * Whether to delete head branches when pull requests are merged
   * @default false
   * @example false
   */
  delete_branch_on_merge?: boolean;
  /**
   * Whether or not a pull request head branch that is behind its base branch can always be updated even if it is not required to be up to date before merging.
   * @default false
   * @example false
   */
  allow_update_branch?: boolean;
  /**
   * Whether a squash merge commit can use the pull request title as default. **This property is closing down. Please use `squash_merge_commit_title` instead.
   * @default false
   * @deprecated
   */
  use_squash_pr_title_as_default?: boolean;
  /**
   * The default value for a squash merge commit title:
   *
   * - `PR_TITLE` - default to the pull request's title.
   * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
   */
  squash_merge_commit_title?: "PR_TITLE" | "COMMIT_OR_PR_TITLE";
  /**
   * The default value for a squash merge commit message:
   *
   * - `PR_BODY` - default to the pull request's body.
   * - `COMMIT_MESSAGES` - default to the branch's commit messages.
   * - `BLANK` - default to a blank commit message.
   */
  squash_merge_commit_message?: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK";
  /**
   * The default value for a merge commit title.
   *
   * - `PR_TITLE` - default to the pull request's title.
   * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
   */
  merge_commit_title?: "PR_TITLE" | "MERGE_MESSAGE";
  /**
   * The default value for a merge commit message.
   *
   * - `PR_TITLE` - default to the pull request's title.
   * - `PR_BODY` - default to the pull request's body.
   * - `BLANK` - default to a blank commit message.
   */
  merge_commit_message?: "PR_BODY" | "PR_TITLE" | "BLANK";
  /**
   * Whether to allow merge commits for pull requests.
   * @default true
   * @example true
   */
  allow_merge_commit?: boolean;
  /**
   * Whether to allow forking this repo
   */
  allow_forking?: boolean;
  /**
   * Whether to require contributors to sign off on web-based commits
   * @default false
   */
  web_commit_signoff_required?: boolean;
  open_issues: number;
  watchers: number;
  master_branch?: string;
  /**
   * @example "\"2020-07-09T00:17:42Z\""
   */
  starred_at?: string;
  /**
   * Whether anonymous git access is enabled for this repository
   */
  anonymous_access_enabled?: boolean;
  /**
   * The status of the code search index for this repository
   */
  code_search_index_status?: {
    lexical_search_ok?: boolean;
    lexical_commit_sha?: string;
  };
};

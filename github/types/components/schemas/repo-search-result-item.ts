import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { nullable_license_simple } from "./nullable-license-simple.js";
import type { search_result_text_matches } from "./search-result-text-matches.js";

/**
 * Repo Search Result Item
 */
export type repo_search_result_item = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: nullable_simple_user;
  private: boolean;
  /**
   * @format uri
   */
  html_url: string;
  description: string;
  fork: boolean;
  /**
   * @format uri
   */
  url: string;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  /**
   * @format date-time
   */
  pushed_at: string;
  /**
   * @format uri
   */
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
  open_issues_count: number;
  master_branch?: string;
  default_branch: string;
  score: number;
  /**
   * @format uri
   */
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  /**
   * @format uri
   */
  teams_url: string;
  /**
   * @format uri
   */
  hooks_url: string;
  issue_events_url: string;
  /**
   * @format uri
   */
  events_url: string;
  assignees_url: string;
  branches_url: string;
  /**
   * @format uri
   */
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  /**
   * @format uri
   */
  languages_url: string;
  /**
   * @format uri
   */
  stargazers_url: string;
  /**
   * @format uri
   */
  contributors_url: string;
  /**
   * @format uri
   */
  subscribers_url: string;
  /**
   * @format uri
   */
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  /**
   * @format uri
   */
  merges_url: string;
  archive_url: string;
  /**
   * @format uri
   */
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  /**
   * @format uri
   */
  deployments_url: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  /**
   * @format uri
   */
  svn_url: string;
  forks: number;
  open_issues: number;
  watchers: number;
  topics?: Array<string>;
  /**
   * @format uri
   */
  mirror_url: string;
  has_issues: boolean;
  has_projects: boolean;
  has_pages: boolean;
  has_wiki: boolean;
  has_downloads: boolean;
  has_discussions?: boolean;
  has_pull_requests?: boolean;
  /**
   * The policy controlling who can create pull requests: all or collaborators_only.
   */
  pull_request_creation_policy?: "all" | "collaborators_only";
  archived: boolean;
  /**
   * Returns whether or not this repository disabled.
   */
  disabled: boolean;
  /**
   * The repository visibility: public, private, or internal.
   */
  visibility?: string;
  license: nullable_license_simple;
  permissions?: {
    admin: boolean;
    maintain?: boolean;
    push: boolean;
    triage?: boolean;
    pull: boolean;
  };
  text_matches?: search_result_text_matches;
  temp_clone_token?: string;
  allow_merge_commit?: boolean;
  allow_squash_merge?: boolean;
  allow_rebase_merge?: boolean;
  allow_auto_merge?: boolean;
  delete_branch_on_merge?: boolean;
  allow_forking?: boolean;
  is_template?: boolean;
  /**
   * @example false
   */
  web_commit_signoff_required?: boolean;
};

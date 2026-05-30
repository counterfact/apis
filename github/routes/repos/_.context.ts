import { createHash } from "node:crypto";
import type { Context$ } from "../../types/_.context.js";
import type { branch_with_protection } from "../../types/components/schemas/branch-with-protection.js";
import type { content_file } from "../../types/components/schemas/content-file.js";
import type { full_repository } from "../../types/components/schemas/full-repository.js";
import type { gist_comment } from "../../types/components/schemas/gist-comment.js";
import type { gist_simple } from "../../types/components/schemas/gist-simple.js";
import type { commit } from "../../types/components/schemas/commit.js";
import type { combined_commit_status } from "../../types/components/schemas/combined-commit-status.js";
import type { commit_comment } from "../../types/components/schemas/commit-comment.js";
import type { issue } from "../../types/components/schemas/issue.js";
import type { issue_comment } from "../../types/components/schemas/issue-comment.js";
import type { job } from "../../types/components/schemas/job.js";
import type { label } from "../../types/components/schemas/label.js";
import type { minimal_repository } from "../../types/components/schemas/minimal-repository.js";
import type { organization_full } from "../../types/components/schemas/organization-full.js";
import type { organization_simple } from "../../types/components/schemas/organization-simple.js";
import type { public_user } from "../../types/components/schemas/public-user.js";
import type { pull_request } from "../../types/components/schemas/pull-request.js";
import type { pull_request_review } from "../../types/components/schemas/pull-request-review.js";
import type { release } from "../../types/components/schemas/release.js";
import type { simple_user } from "../../types/components/schemas/simple-user.js";
import type { simple_commit_status } from "../../types/components/schemas/simple-commit-status.js";
import type { status } from "../../types/components/schemas/status.js";
import type { workflow } from "../../types/components/schemas/workflow.js";
import type { workflow_run } from "../../types/components/schemas/workflow-run.js";
import type { Context as GistsContext } from "../gists/_.context.js";
import {
  toSimpleUser,
  type Context as UsersContext,
} from "../users/_.context.js";

type RepoKey = `${string}/${string}`;

type RepoState = {
  repository: full_repository;
  readme?: content_file;
  branches: Map<string, branch_with_protection>;
  commits: Map<string, commit>;
  commitStatuses: Map<string, Array<status>>;
  commitComments: Map<string, Array<commit_comment>>;
  labels: Map<string, label>;
  issues: Map<number, issue>;
  issueComments: Map<number, Map<number, issue_comment>>;
  pulls: Map<number, pull_request>;
  reviews: Map<number, Map<number, pull_request_review>>;
  workflows: Map<number, workflow>;
  runs: Map<number, workflow_run>;
  jobs: Map<number, Array<job>>;
  releases: Map<number, release>;
  nextCommitCommentId: number;
  nextIssueNumber: number;
  nextPullNumber: number;
  nextReleaseId: number;
};

const API_URL = "https://api.github.com";
const APP_URL = "https://github.com";
const DEFAULT_USER_LOGIN = "octocat";
const DEFAULT_PAGE_SIZE = 30;

const isoNow = () => new Date().toISOString();

const hashFor = (...parts: Array<string | number>) =>
  createHash("sha1").update(parts.join(":")).digest("hex");

const base64 = (value: string) => Buffer.from(value).toString("base64");

const repoKey = (owner: string, repo: string): RepoKey => `${owner}/${repo}`;

const asNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
};

const paginate = <T>(
  items: Array<T>,
  query?: { page?: unknown; per_page?: unknown },
) => {
  const page = asNumber(query?.page, 1);
  const perPage = asNumber(query?.per_page, DEFAULT_PAGE_SIZE);
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
};

const matchTerms = (value: string, terms: Array<string>) => {
  const haystack = value.toLowerCase();
  return terms.every((term) => haystack.includes(term));
};

const parseSearchQuery = (query: string) => {
  const qualifiers = new Map<string, Array<string>>();
  const terms: Array<string> = [];

  for (const token of query.match(/"[^"]+"|\S+/g) ?? []) {
    const normalized = token.replace(/^"|"$/g, "");
    const qualifier = normalized.match(/^([a-z_]+):(.*)$/i);
    if (qualifier) {
      const [, key, value] = qualifier;
      const values = qualifiers.get(key.toLowerCase()) ?? [];
      values.push(value.toLowerCase());
      qualifiers.set(key.toLowerCase(), values);
      continue;
    }
    terms.push(normalized.toLowerCase());
  }

  return { qualifiers, terms };
};

const hasQualifier = (
  qualifiers: Map<string, Array<string>>,
  key: string,
  predicate: (value: string) => boolean,
) => {
  const values = qualifiers.get(key);
  return values == null || values.length === 0 || values.some(predicate);
};

const makeSimpleUser = (
  login: string,
  id: number,
  type: string = "User",
  name?: string,
): simple_user => ({
  login,
  id,
  node_id: `U_${id}`,
  avatar_url: `${APP_URL}/${login}.png`,
  gravatar_id: "",
  url: `${API_URL}/users/${login}`,
  html_url: `${APP_URL}/${login}`,
  followers_url: `${API_URL}/users/${login}/followers`,
  following_url: `${API_URL}/users/${login}/following{/other_user}`,
  gists_url: `${API_URL}/users/${login}/gists{/gist_id}`,
  starred_url: `${API_URL}/users/${login}/starred{/owner}{/repo}`,
  subscriptions_url: `${API_URL}/users/${login}/subscriptions`,
  organizations_url: `${API_URL}/users/${login}/orgs`,
  repos_url: `${API_URL}/users/${login}/repos`,
  events_url: `${API_URL}/users/${login}/events{/privacy}`,
  received_events_url: `${API_URL}/users/${login}/received_events`,
  type,
  site_admin: false,
  name,
  email: name ? `${login}@example.com` : undefined,
});

const makeCommit = (
  owner: string,
  repo: string,
  branch: string,
  actor: simple_user,
  sha: string = hashFor(owner, repo, branch),
) =>
  ({
    url: `${API_URL}/repos/${owner}/${repo}/commits/${sha}`,
    sha,
    node_id: `C_${sha}`,
    html_url: `${APP_URL}/${owner}/${repo}/commit/${sha}`,
    comments_url: `${API_URL}/repos/${owner}/${repo}/commits/${sha}/comments`,
    commit: {
      url: `${API_URL}/repos/${owner}/${repo}/commits/${sha}`,
      author: {
        name: actor.name ?? actor.login,
        email: actor.email ?? `${actor.login}@example.com`,
        date: isoNow(),
      },
      committer: {
        name: actor.name ?? actor.login,
        email: actor.email ?? `${actor.login}@example.com`,
        date: isoNow(),
      },
      message: `Latest commit on ${branch}`,
      comment_count: 0,
      tree: {
        sha: hashFor(owner, repo, branch, "tree"),
        url: `${API_URL}/repos/${owner}/${repo}/git/trees/${hashFor(owner, repo, branch, "tree")}`,
      },
    },
    author: actor,
    committer: actor,
    parents: [],
  }) as const;

const makeBranch = (
  owner: string,
  repo: string,
  branch: string,
  actor: simple_user,
): branch_with_protection => ({
  name: branch,
  commit: makeCommit(owner, repo, branch, actor),
  _links: {
    html: `${APP_URL}/${owner}/${repo}/tree/${branch}`,
    self: `${API_URL}/repos/${owner}/${repo}/branches/${branch}`,
  },
  protected: branch === "main",
  protection: {
    enabled: branch === "main",
    required_pull_request_reviews: {
      dismissal_restrictions: { users: [], teams: [], apps: [], url: "" },
      dismiss_stale_reviews: false,
      require_code_owner_reviews: false,
      required_approving_review_count: branch === "main" ? 1 : 0,
      require_last_push_approval: false,
      bypass_pull_request_allowances: { users: [], teams: [], apps: [] },
    },
    required_status_checks: {
      enforcement_level: "non_admins",
      contexts: branch === "main" ? ["ci"] : [],
      checks: [],
    },
  },
  protection_url: `${API_URL}/repos/${owner}/${repo}/branches/${branch}/protection`,
  required_approving_review_count: branch === "main" ? 1 : 0,
});

const makeReadme = (
  owner: string,
  repo: string,
  content: string,
  name: string = "README.md",
): content_file => ({
  type: "file",
  encoding: "base64",
  size: content.length,
  name,
  path: name,
  content: base64(content),
  sha: hashFor(owner, repo, name, content),
  url: `${API_URL}/repos/${owner}/${repo}/contents/${name}`,
  git_url: `${API_URL}/repos/${owner}/${repo}/git/blobs/${hashFor(owner, repo, name, content)}`,
  html_url: `${APP_URL}/${owner}/${repo}/blob/main/${name}`,
  download_url: `${APP_URL}/${owner}/${repo}/raw/main/${name}`,
  _links: {
    git: `${API_URL}/repos/${owner}/${repo}/git/blobs/${hashFor(owner, repo, name, content)}`,
    html: `${APP_URL}/${owner}/${repo}/blob/main/${name}`,
    self: `${API_URL}/repos/${owner}/${repo}/contents/${name}`,
  },
});

export class Context {
  private reposByKey = new Map<RepoKey, RepoState>();

  private nextRepoId = 1000;
  private nextIssueId = 2000;
  private nextIssueCommentId = 3000;
  private nextPullId = 4000;
  private nextReviewId = 5000;
  private nextWorkflowId = 6000;
  private nextRunId = 7000;
  private nextJobId = 8000;
  private nextStatusId = 9000;
  private nextLabelId = 10000;
  private readonly loadContext: (path: string) => unknown;

  constructor($: Context$) {
    this.loadContext = $.loadContext;
  }

  private gistsContext(): GistsContext {
    return this.loadContext("/gists") as GistsContext;
  }

  private usersContext(): UsersContext {
    return this.loadContext("/users") as UsersContext;
  }

  saveGist(
    gist: Partial<gist_simple> & { files: NonNullable<gist_simple["files"]> },
  ): gist_simple {
    return this.gistsContext().saveGist(gist);
  }

  getGist(id: string): gist_simple | undefined {
    return this.gistsContext().getGist(id);
  }

  hasGist(id: string): boolean {
    return this.gistsContext().hasGist(id);
  }

  deleteGist(id: string): boolean {
    return this.gistsContext().deleteGist(id);
  }

  listGists(): gist_simple[] {
    return this.gistsContext().listGists();
  }

  listPublicGists(): gist_simple[] {
    return this.gistsContext().listPublicGists();
  }

  starGist(id: string): void {
    this.gistsContext().starGist(id);
  }

  unstarGist(id: string): void {
    this.gistsContext().unstarGist(id);
  }

  isGistStarred(id: string): boolean {
    return this.gistsContext().isGistStarred(id);
  }

  listStarredGists(): gist_simple[] {
    return this.gistsContext().listStarredGists();
  }

  saveComment(
    gistId: string,
    comment: Partial<gist_comment> & { body: string },
  ): gist_comment {
    return this.gistsContext().saveComment(gistId, comment);
  }

  getComment(gistId: string, commentId: number): gist_comment | undefined {
    return this.gistsContext().getComment(gistId, commentId);
  }

  hasComment(gistId: string, commentId: number): boolean {
    return this.gistsContext().hasComment(gistId, commentId);
  }

  deleteComment(gistId: string, commentId: number): boolean {
    return this.gistsContext().deleteComment(gistId, commentId);
  }

  listComments(gistId: string): gist_comment[] {
    return this.gistsContext().listComments(gistId);
  }

  saveUser(user: Partial<public_user> & { login: string }): public_user {
    return this.usersContext().saveUser(user);
  }

  getUser(login: string): public_user | undefined {
    return this.usersContext().getUser(login);
  }

  listUsers(query?: {
    since?: unknown;
    per_page?: unknown;
  }): Array<public_user> {
    return this.usersContext().listUsers(query);
  }

  listSimpleUsers(query?: {
    since?: unknown;
    per_page?: unknown;
  }): Array<simple_user> {
    return this.usersContext().listSimpleUsers(query);
  }

  saveOrganization(
    organization: Partial<organization_full> & { login: string },
  ): organization_full {
    return this.usersContext().saveOrganization(organization);
  }

  getOrganization(login: string): organization_full | undefined {
    return this.usersContext().getOrganization(login);
  }

  listOrganizations(query?: { since?: unknown; per_page?: unknown }) {
    return this.usersContext().listOrganizations(query);
  }

  listSimpleOrganizations(query?: {
    since?: unknown;
    per_page?: unknown;
  }): Array<organization_simple> {
    return this.usersContext().listSimpleOrganizations(query);
  }

  private ensureDefaultUser() {
    return (
      this.getUser(DEFAULT_USER_LOGIN) ??
      this.saveUser({ login: DEFAULT_USER_LOGIN })
    );
  }

  private ensureUser(login: string): public_user {
    return this.getUser(login) ?? this.saveUser({ login });
  }

  private resolveOwner(login: string): simple_user {
    const org = this.getOrganization(login);
    if (org) {
      return {
        login: org.login,
        id: org.id,
        node_id: org.node_id,
        avatar_url: org.avatar_url,
        gravatar_id: "",
        url: org.url,
        html_url: org.html_url,
        followers_url: `${API_URL}/users/${org.login}/followers`,
        following_url: `${API_URL}/users/${org.login}/following{/other_user}`,
        gists_url: `${API_URL}/users/${org.login}/gists{/gist_id}`,
        starred_url: `${API_URL}/users/${org.login}/starred{/owner}{/repo}`,
        subscriptions_url: `${API_URL}/users/${org.login}/subscriptions`,
        organizations_url: `${API_URL}/users/${org.login}/orgs`,
        repos_url: `${API_URL}/users/${org.login}/repos`,
        events_url: `${API_URL}/users/${org.login}/events{/privacy}`,
        received_events_url: `${API_URL}/users/${org.login}/received_events`,
        type: "Organization",
        site_admin: false,
        name: org.name,
      };
    }
    return toSimpleUser(this.ensureUser(login));
  }

  private getRepoState(owner: string, repo: string) {
    return this.reposByKey.get(repoKey(owner, repo));
  }

  private upsertRepoState(owner: string, repo: string, state: RepoState) {
    this.reposByKey.set(repoKey(owner, repo), state);
  }

  private syncRepoCounts(owner: string, repo: string) {
    const state = this.getRepoState(owner, repo);
    if (!state) return;
    const openIssues = [...state.issues.values()].filter(
      (issueItem) => issueItem.state === "open",
    ).length;
    state.repository.open_issues_count = openIssues;
    state.repository.open_issues = openIssues;
  }

  private syncIssueLabels(
    state: RepoState,
    previousName: string,
    nextLabel?: label,
  ) {
    for (const issueItem of state.issues.values()) {
      issueItem.labels = issueItem.labels.flatMap((item) => {
        const itemName = typeof item === "string" ? item : item.name;
        if (itemName !== previousName) {
          return [item];
        }
        return nextLabel ? [nextLabel] : [];
      });
    }
  }

  private resolveIssueLabels(
    owner: string,
    repo: string,
    labels: issue["labels"],
  ): Array<label> {
    const resolved = new Map<string, label>();
    for (const item of labels) {
      const input =
        typeof item === "string"
          ? { name: item, color: "ededed", description: "" }
          : {
              name: item.name ?? "",
              color: item.color ?? "ededed",
              description: item.description ?? "",
            };
      const name = input.name.trim();
      if (!name) {
        continue;
      }
      resolved.set(
        name,
        this.getLabel(owner, repo, name) ??
          this.saveLabel(owner, repo, {
            name,
            color: input.color,
            description: input.description,
          }),
      );
    }
    return [...resolved.values()];
  }

  saveRepository(
    repository: Partial<full_repository> & {
      owner: string | simple_user;
      name: string;
      readme?: string;
      branches?: Array<string>;
      default_branch?: string;
      language?: string;
    },
  ): full_repository {
    const owner =
      typeof repository.owner === "string"
        ? this.resolveOwner(repository.owner)
        : repository.owner;
    const existing = this.getRepoState(owner.login, repository.name);
    const now = isoNow();
    const id = repository.id ?? existing?.repository.id ?? this.nextRepoId++;
    const defaultBranch =
      repository.default_branch ??
      existing?.repository.default_branch ??
      "main";
    const fullName = `${owner.login}/${repository.name}`;
    const repoUrl = `${API_URL}/repos/${fullName}`;

    const fullRepository: full_repository = {
      ...(existing?.repository ?? {}),
      ...repository,
      id,
      node_id: repository.node_id ?? existing?.repository.node_id ?? `R_${id}`,
      name: repository.name,
      full_name: fullName,
      owner,
      private: repository.private ?? existing?.repository.private ?? false,
      html_url: `${APP_URL}/${fullName}`,
      description:
        repository.description ??
        existing?.repository.description ??
        `${repository.name} repository`,
      fork: repository.fork ?? existing?.repository.fork ?? false,
      url: repoUrl,
      archive_url: `${repoUrl}/{archive_format}{/ref}`,
      assignees_url: `${repoUrl}/assignees{/user}`,
      blobs_url: `${repoUrl}/git/blobs{/sha}`,
      branches_url: `${repoUrl}/branches{/branch}`,
      collaborators_url: `${repoUrl}/collaborators{/collaborator}`,
      comments_url: `${repoUrl}/comments{/number}`,
      commits_url: `${repoUrl}/commits{/sha}`,
      compare_url: `${repoUrl}/compare/{base}...{head}`,
      contents_url: `${repoUrl}/contents/{+path}`,
      contributors_url: `${repoUrl}/contributors`,
      deployments_url: `${repoUrl}/deployments`,
      downloads_url: `${repoUrl}/downloads`,
      events_url: `${repoUrl}/events`,
      forks_url: `${repoUrl}/forks`,
      git_commits_url: `${repoUrl}/git/commits{/sha}`,
      git_refs_url: `${repoUrl}/git/refs{/sha}`,
      git_tags_url: `${repoUrl}/git/tags{/sha}`,
      git_url: `git://github.com/${fullName}.git`,
      issue_comment_url: `${repoUrl}/issues/comments{/number}`,
      issue_events_url: `${repoUrl}/issues/events{/number}`,
      issues_url: `${repoUrl}/issues{/number}`,
      keys_url: `${repoUrl}/keys{/key_id}`,
      labels_url: `${repoUrl}/labels{/name}`,
      languages_url: `${repoUrl}/languages`,
      merges_url: `${repoUrl}/merges`,
      milestones_url: `${repoUrl}/milestones{/number}`,
      notifications_url: `${repoUrl}/notifications{?since,all,participating}`,
      pulls_url: `${repoUrl}/pulls{/number}`,
      releases_url: `${repoUrl}/releases{/id}`,
      ssh_url: `git@github.com:${fullName}.git`,
      stargazers_url: `${repoUrl}/stargazers`,
      statuses_url: `${repoUrl}/statuses/{sha}`,
      subscribers_url: `${repoUrl}/subscribers`,
      subscription_url: `${repoUrl}/subscription`,
      tags_url: `${repoUrl}/tags`,
      teams_url: `${repoUrl}/teams`,
      trees_url: `${repoUrl}/git/trees{/sha}`,
      clone_url: `${APP_URL}/${fullName}.git`,
      mirror_url: "",
      hooks_url: `${repoUrl}/hooks`,
      svn_url: `${APP_URL}/${fullName}`,
      homepage: repository.homepage ?? existing?.repository.homepage ?? "",
      language:
        repository.language ?? existing?.repository.language ?? "TypeScript",
      forks_count:
        repository.forks_count ?? existing?.repository.forks_count ?? 0,
      stargazers_count:
        repository.stargazers_count ??
        existing?.repository.stargazers_count ??
        0,
      watchers_count:
        repository.watchers_count ?? existing?.repository.watchers_count ?? 0,
      size: repository.size ?? existing?.repository.size ?? 1,
      default_branch: defaultBranch,
      open_issues_count:
        repository.open_issues_count ??
        existing?.repository.open_issues_count ??
        0,
      has_issues:
        repository.has_issues ?? existing?.repository.has_issues ?? true,
      has_projects:
        repository.has_projects ?? existing?.repository.has_projects ?? true,
      has_wiki: repository.has_wiki ?? existing?.repository.has_wiki ?? true,
      has_pages:
        repository.has_pages ?? existing?.repository.has_pages ?? false,
      has_downloads:
        repository.has_downloads ?? existing?.repository.has_downloads ?? true,
      has_discussions:
        repository.has_discussions ??
        existing?.repository.has_discussions ??
        true,
      has_pull_requests:
        repository.has_pull_requests ??
        existing?.repository.has_pull_requests ??
        true,
      pull_request_creation_policy:
        repository.pull_request_creation_policy ??
        existing?.repository.pull_request_creation_policy ??
        "all",
      archived: repository.archived ?? existing?.repository.archived ?? false,
      disabled: repository.disabled ?? existing?.repository.disabled ?? false,
      visibility:
        repository.visibility ??
        existing?.repository.visibility ??
        (repository.private ? "private" : "public"),
      pushed_at: repository.pushed_at ?? existing?.repository.pushed_at ?? now,
      created_at:
        existing?.repository.created_at ?? repository.created_at ?? now,
      updated_at: now,
      permissions: repository.permissions ??
        existing?.repository.permissions ?? {
          admin: true,
          push: true,
          pull: true,
          maintain: true,
        },
      allow_rebase_merge:
        repository.allow_rebase_merge ??
        existing?.repository.allow_rebase_merge ??
        true,
      allow_squash_merge:
        repository.allow_squash_merge ??
        existing?.repository.allow_squash_merge ??
        true,
      allow_auto_merge:
        repository.allow_auto_merge ??
        existing?.repository.allow_auto_merge ??
        false,
      delete_branch_on_merge:
        repository.delete_branch_on_merge ??
        existing?.repository.delete_branch_on_merge ??
        false,
      allow_merge_commit:
        repository.allow_merge_commit ??
        existing?.repository.allow_merge_commit ??
        true,
      allow_update_branch:
        repository.allow_update_branch ??
        existing?.repository.allow_update_branch ??
        true,
      use_squash_pr_title_as_default:
        repository.use_squash_pr_title_as_default ??
        existing?.repository.use_squash_pr_title_as_default ??
        false,
      squash_merge_commit_title:
        repository.squash_merge_commit_title ??
        existing?.repository.squash_merge_commit_title ??
        "PR_TITLE",
      squash_merge_commit_message:
        repository.squash_merge_commit_message ??
        existing?.repository.squash_merge_commit_message ??
        "PR_BODY",
      merge_commit_title:
        repository.merge_commit_title ??
        existing?.repository.merge_commit_title ??
        "PR_TITLE",
      merge_commit_message:
        repository.merge_commit_message ??
        existing?.repository.merge_commit_message ??
        "PR_BODY",
      allow_forking:
        repository.allow_forking ?? existing?.repository.allow_forking ?? true,
      web_commit_signoff_required:
        repository.web_commit_signoff_required ??
        existing?.repository.web_commit_signoff_required ??
        false,
      subscribers_count:
        repository.subscribers_count ??
        existing?.repository.subscribers_count ??
        0,
      network_count:
        repository.network_count ?? existing?.repository.network_count ?? 0,
      license: repository.license ?? existing?.repository.license ?? null,
      organization:
        this.getOrganization(owner.login) != null
          ? (makeSimpleUser(
              owner.login,
              owner.id,
              "Organization",
              owner.name,
            ) as never)
          : existing?.repository.organization,
      forks: repository.forks ?? existing?.repository.forks ?? 0,
      master_branch:
        repository.master_branch ??
        existing?.repository.master_branch ??
        defaultBranch,
      open_issues:
        repository.open_issues ?? existing?.repository.open_issues ?? 0,
      watchers: repository.watchers ?? existing?.repository.watchers ?? 0,
      anonymous_access_enabled:
        repository.anonymous_access_enabled ??
        existing?.repository.anonymous_access_enabled ??
        true,
    };

    const state: RepoState = existing ?? {
      repository: fullRepository,
      branches: new Map(),
      commits: new Map(),
      commitStatuses: new Map(),
      commitComments: new Map(),
      labels: new Map(),
      issues: new Map(),
      issueComments: new Map(),
      pulls: new Map(),
      reviews: new Map(),
      workflows: new Map(),
      runs: new Map(),
      jobs: new Map(),
      releases: new Map(),
      nextCommitCommentId: 1,
      nextIssueNumber: 1,
      nextPullNumber: 1,
      nextReleaseId: 1,
    };

    state.repository = fullRepository;
    state.commits ??= new Map();
    state.commitStatuses ??= new Map();
    state.commitComments ??= new Map();
    state.labels ??= new Map();
    state.nextCommitCommentId ??= 1;

    const branches = repository.branches ?? [defaultBranch];
    for (const branch of new Set([defaultBranch, ...branches])) {
      const branchDetails = makeBranch(
        owner.login,
        repository.name,
        branch,
        owner,
      );
      state.branches.set(branch, branchDetails);
      state.commits.set(
        branchDetails.commit.sha,
        branchDetails.commit as commit,
      );
    }

    if (repository.readme != null) {
      state.readme = makeReadme(
        owner.login,
        repository.name,
        repository.readme,
      );
    }

    this.upsertRepoState(owner.login, repository.name, state);
    this.nextRepoId = Math.max(this.nextRepoId, id + 1);
    this.syncRepoCounts(owner.login, repository.name);
    return fullRepository;
  }

  getRepository(owner: string, repo: string): full_repository | undefined {
    return this.getRepoState(owner, repo)?.repository;
  }

  hasRepository(owner: string, repo: string): boolean {
    return this.getRepoState(owner, repo) != null;
  }

  updateRepository(
    owner: string,
    repo: string,
    changes: Partial<full_repository> & { readme?: string },
  ): full_repository | undefined {
    const state = this.getRepoState(owner, repo);
    if (!state) return undefined;

    if (changes.readme != null) {
      state.readme = makeReadme(owner, repo, changes.readme);
    }

    return this.saveRepository({
      ...state.repository,
      ...changes,
      owner,
      name: changes.name ?? repo,
      readme: changes.readme,
    });
  }

  deleteRepository(owner: string, repo: string): boolean {
    return this.reposByKey.delete(repoKey(owner, repo));
  }

  listRepositories(): Array<full_repository> {
    return [...this.reposByKey.values()]
      .map((state) => state.repository)
      .sort((left, right) => left.id - right.id);
  }

  listUserRepositories(query?: {
    visibility?: string;
    type?: string;
    sort?: string;
    direction?: string;
    page?: unknown;
    per_page?: unknown;
  }) {
    let repositories = [...this.listRepositories()];

    if (query?.visibility === "public") {
      repositories = repositories.filter((repository) => !repository.private);
    }
    if (query?.visibility === "private") {
      repositories = repositories.filter((repository) => repository.private);
    }
    if (query?.type === "owner") {
      repositories = repositories.filter(
        (repository) => repository.owner.type === "User",
      );
    }

    const sortField = query?.sort ?? "updated";
    repositories.sort((left, right) => {
      const direction = query?.direction === "asc" ? 1 : -1;
      if (sortField === "full_name") {
        return left.full_name.localeCompare(right.full_name) * direction;
      }
      if (sortField === "created") {
        return (
          (new Date(left.created_at).getTime() -
            new Date(right.created_at).getTime()) *
          direction
        );
      }
      return (
        (new Date(left.updated_at).getTime() -
          new Date(right.updated_at).getTime()) *
        direction
      );
    });

    return paginate(repositories, query);
  }

  listRepositoriesForOwner(
    owner: string,
    query?: {
      type?: string;
      sort?: string;
      direction?: string;
      page?: unknown;
      per_page?: unknown;
    },
  ) {
    let repositories = this.listRepositories().filter(
      (repository) => repository.owner.login === owner,
    );

    if (query?.type === "public") {
      repositories = repositories.filter((repository) => !repository.private);
    }
    if (query?.type === "private") {
      repositories = repositories.filter((repository) => repository.private);
    }

    const direction = query?.direction === "asc" ? 1 : -1;
    repositories.sort((left, right) => {
      if (query?.sort === "created") {
        return (
          (new Date(left.created_at).getTime() -
            new Date(right.created_at).getTime()) *
          direction
        );
      }
      return left.full_name.localeCompare(right.full_name) * direction;
    });

    return paginate(repositories, query);
  }

  getRepositoryReadme(owner: string, repo: string): content_file | undefined {
    return this.getRepoState(owner, repo)?.readme;
  }

  getRepositoryBranch(
    owner: string,
    repo: string,
    branch: string,
  ): branch_with_protection | undefined {
    return this.getRepoState(owner, repo)?.branches.get(branch);
  }

  private resolveCommitRef(state: RepoState, ref: string): commit | undefined {
    const branchCommit = state.branches.get(ref)?.commit as commit | undefined;
    if (branchCommit) {
      state.commits.set(branchCommit.sha, branchCommit);
      return branchCommit;
    }

    const exact = state.commits.get(ref);
    if (exact) {
      return exact;
    }

    const prefixMatches = [...state.commits.values()].filter((item) =>
      item.sha.startsWith(ref),
    );
    return prefixMatches.length === 1 ? prefixMatches[0] : undefined;
  }

  getCommit(owner: string, repo: string, ref: string): commit | undefined {
    const state = this.getRepoState(owner, repo);
    if (!state) {
      return undefined;
    }
    return this.resolveCommitRef(state, ref);
  }

  listCommits(
    owner: string,
    repo: string,
    query?: { sha?: string; per_page?: unknown; page?: unknown },
  ): commit[] {
    const state = this.getRepoState(owner, repo);
    if (!state) {
      return [];
    }

    const commits = [...state.commits.values()].sort(
      (left, right) =>
        new Date(right.commit.committer?.date ?? 0).getTime() -
        new Date(left.commit.committer?.date ?? 0).getTime(),
    );

    if (query?.sha) {
      const resolved = this.resolveCommitRef(state, query.sha);
      return paginate(
        resolved ? commits.filter((item) => item.sha === resolved.sha) : [],
        query,
      );
    }

    const resolvedDefaultBranchCommit = this.resolveCommitRef(
      state,
      state.repository.default_branch,
    );
    return paginate(
      resolvedDefaultBranchCommit ? [resolvedDefaultBranchCommit] : [],
      query,
    );
  }

  saveCommitStatus(
    owner: string,
    repo: string,
    sha: string,
    statusInput: {
      state: string;
      context: string;
      description?: string;
      target_url?: string;
    },
  ): status {
    const state = this.getRepoState(owner, repo);
    const commitItem = state ? this.resolveCommitRef(state, sha) : undefined;
    if (!state || !commitItem) {
      throw new Error(`Commit ${owner}/${repo}@${sha} does not exist`);
    }

    const now = isoNow();
    const id = this.nextStatusId++;
    const created: status = {
      id,
      node_id: `STS_${id}`,
      state: statusInput.state,
      context: statusInput.context,
      description: statusInput.description ?? "",
      target_url: statusInput.target_url ?? "",
      url: `${API_URL}/repos/${owner}/${repo}/statuses/${commitItem.sha}`,
      avatar_url: `${APP_URL}/${DEFAULT_USER_LOGIN}.png`,
      created_at: now,
      updated_at: now,
      creator: toSimpleUser(this.ensureDefaultUser()),
    };

    const statuses = state.commitStatuses.get(commitItem.sha) ?? [];
    statuses.push(created);
    state.commitStatuses.set(commitItem.sha, statuses);
    return created;
  }

  listCommitStatuses(
    owner: string,
    repo: string,
    sha: string,
    query?: { per_page?: unknown; page?: unknown },
  ): status[] {
    const state = this.getRepoState(owner, repo);
    const commitItem = state ? this.resolveCommitRef(state, sha) : undefined;
    if (!state || !commitItem) {
      return [];
    }

    const statuses = [...(state.commitStatuses.get(commitItem.sha) ?? [])].sort(
      (left, right) => {
        const byDate =
          new Date(right.created_at).getTime() -
          new Date(left.created_at).getTime();
        return byDate !== 0 ? byDate : right.id - left.id;
      },
    );
    return paginate(statuses, query);
  }

  getCombinedStatus(
    owner: string,
    repo: string,
    ref: string,
  ): combined_commit_status | undefined {
    const state = this.getRepoState(owner, repo);
    const commitItem = state ? this.resolveCommitRef(state, ref) : undefined;
    if (!state || !commitItem) {
      return undefined;
    }

    const statuses = this.listCommitStatuses(owner, repo, commitItem.sha);
    const latestStatusesByContext = new Map<string, status>();
    for (const item of statuses) {
      if (!latestStatusesByContext.has(item.context)) {
        latestStatusesByContext.set(item.context, item);
      }
    }
    const latestStatuses = [...latestStatusesByContext.values()];
    let combinedState = "success";

    if (latestStatuses.some((item) => item.state === "failure")) {
      combinedState = "failure";
    } else if (latestStatuses.some((item) => item.state === "error")) {
      combinedState = "error";
    } else if (
      latestStatuses.length === 0 ||
      latestStatuses.some((item) => item.state === "pending")
    ) {
      combinedState = "pending";
    }

    const simpleStatuses: Array<simple_commit_status> = statuses.map(
      (item) => ({
        description: item.description,
        id: item.id,
        node_id: item.node_id,
        state: item.state,
        context: item.context,
        target_url: item.target_url,
        avatar_url: item.avatar_url,
        url: item.url,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }),
    );

    return {
      state: combinedState,
      statuses: simpleStatuses,
      sha: commitItem.sha,
      total_count: simpleStatuses.length,
      repository: state.repository as minimal_repository,
      commit_url: commitItem.url,
      url: `${API_URL}/repos/${owner}/${repo}/commits/${commitItem.sha}/status`,
    };
  }

  saveCommitComment(
    owner: string,
    repo: string,
    sha: string,
    input: { body: string; path?: string; line?: number },
  ): commit_comment {
    const state = this.getRepoState(owner, repo);
    const commitItem = state ? this.resolveCommitRef(state, sha) : undefined;
    if (!state || !commitItem) {
      throw new Error(`Commit ${owner}/${repo}@${sha} does not exist`);
    }

    const id = state.nextCommitCommentId++;
    const now = isoNow();
    const comment: commit_comment = {
      id,
      node_id: `CC_${id}`,
      body: input.body,
      path: input.path ?? "",
      position: input.line ?? 0,
      line: input.line ?? 0,
      commit_id: commitItem.sha,
      user: toSimpleUser(this.ensureDefaultUser()),
      created_at: now,
      updated_at: now,
      author_association: "OWNER",
      html_url: `${APP_URL}/${owner}/${repo}/commit/${commitItem.sha}#commitcomment-${id}`,
      url: `${API_URL}/repos/${owner}/${repo}/comments/${id}`,
    };

    const comments = state.commitComments.get(commitItem.sha) ?? [];
    comments.push(comment);
    state.commitComments.set(commitItem.sha, comments);
    commitItem.commit.comment_count = comments.length;
    return comment;
  }

  listCommitComments(
    owner: string,
    repo: string,
    sha: string,
    query?: { per_page?: unknown; page?: unknown },
  ): commit_comment[] {
    const state = this.getRepoState(owner, repo);
    const commitItem = state ? this.resolveCommitRef(state, sha) : undefined;
    if (!state || !commitItem) {
      return [];
    }

    const comments = [...(state.commitComments.get(commitItem.sha) ?? [])].sort(
      (left, right) => left.id - right.id,
    );
    return paginate(comments, query);
  }

  saveLabel(
    owner: string,
    repo: string,
    input: { name: string; color: string; description?: string },
  ): label {
    const state = this.getRepoState(owner, repo);
    if (!state) {
      throw new Error(`Repository ${owner}/${repo} does not exist`);
    }

    const name = input.name.trim();
    const existing = state.labels.get(name);
    const id = existing?.id ?? this.nextLabelId++;
    const nextLabel: label = {
      id,
      node_id: existing?.node_id ?? `LA_${id}`,
      url: `${API_URL}/repos/${owner}/${repo}/labels/${encodeURIComponent(name)}`,
      name,
      color: input.color,
      description: input.description ?? existing?.description ?? "",
      default: false,
    };

    state.labels.set(name, nextLabel);
    this.syncIssueLabels(state, name, nextLabel);
    this.nextLabelId = Math.max(this.nextLabelId, id + 1);
    return nextLabel;
  }

  getLabel(owner: string, repo: string, name: string): label | undefined {
    return this.getRepoState(owner, repo)?.labels.get(name);
  }

  updateLabel(
    owner: string,
    repo: string,
    name: string,
    patch: Partial<label>,
  ): label | undefined {
    const state = this.getRepoState(owner, repo);
    const existing = state?.labels.get(name);
    if (!state || !existing) {
      return undefined;
    }

    const nextName = patch.name?.trim() || existing.name;
    const nextLabel: label = {
      ...existing,
      ...patch,
      name: nextName,
      url: `${API_URL}/repos/${owner}/${repo}/labels/${encodeURIComponent(nextName)}`,
      description: patch.description ?? existing.description ?? "",
      default: existing.default,
    };

    if (nextName !== name) {
      state.labels.delete(name);
    }
    state.labels.set(nextName, nextLabel);
    this.syncIssueLabels(state, name, nextLabel);
    return nextLabel;
  }

  deleteLabel(owner: string, repo: string, name: string): boolean {
    const state = this.getRepoState(owner, repo);
    if (!state || !state.labels.has(name)) {
      return false;
    }
    state.labels.delete(name);
    this.syncIssueLabels(state, name);
    return true;
  }

  listLabels(
    owner: string,
    repo: string,
    query?: { page?: unknown; per_page?: unknown },
  ): label[] {
    return paginate([...(this.getRepoState(owner, repo)?.labels.values() ?? [])], query);
  }

  saveIssue(
    owner: string,
    repo: string,
    issueInput: Partial<issue> & {
      title: string | number;
      body?: string;
      labels?: issue["labels"];
      state?: string;
      number?: number;
    },
  ): issue {
    const state = this.getRepoState(owner, repo);
    if (!state) {
      throw new Error(`Repository ${owner}/${repo} does not exist`);
    }

    const now = isoNow();
    const number = issueInput.number ?? state.nextIssueNumber++;
    const existing = state.issues.get(number);
    const id = issueInput.id ?? existing?.id ?? this.nextIssueId++;
    const author =
      issueInput.user ??
      existing?.user ??
      toSimpleUser(this.ensureDefaultUser());
    const repoUrl = `${API_URL}/repos/${owner}/${repo}`;
    const comments =
      state.issueComments.get(number)?.size ?? existing?.comments ?? 0;
    const nextIssue: issue = {
      ...(existing ?? {}),
      ...issueInput,
      id,
      node_id: issueInput.node_id ?? existing?.node_id ?? `I_${id}`,
      url: `${repoUrl}/issues/${number}`,
      repository_url: repoUrl,
      labels_url: `${repoUrl}/issues/${number}/labels{/name}`,
      comments_url: `${repoUrl}/issues/${number}/comments`,
      events_url: `${repoUrl}/issues/${number}/events`,
      html_url: `${APP_URL}/${owner}/${repo}/issues/${number}`,
      number,
      state: issueInput.state ?? existing?.state ?? "open",
      state_reason: issueInput.state_reason ?? existing?.state_reason,
      title: String(issueInput.title),
      body: issueInput.body ?? existing?.body ?? "",
      user: author,
      labels:
        issueInput.labels != null
          ? this.resolveIssueLabels(owner, repo, issueInput.labels)
          : (existing?.labels ?? []),
      assignee: issueInput.assignee ?? existing?.assignee ?? null,
      assignees: issueInput.assignees ?? existing?.assignees ?? [],
      milestone: issueInput.milestone ?? existing?.milestone ?? null,
      locked: issueInput.locked ?? existing?.locked ?? false,
      active_lock_reason:
        issueInput.active_lock_reason ?? existing?.active_lock_reason,
      comments,
      closed_at:
        issueInput.state === "closed"
          ? (issueInput.closed_at ?? existing?.closed_at ?? now)
          : (issueInput.closed_at ?? existing?.closed_at ?? ""),
      created_at: existing?.created_at ?? issueInput.created_at ?? now,
      updated_at: now,
      draft: issueInput.draft ?? existing?.draft ?? false,
      closed_by: issueInput.closed_by ?? existing?.closed_by,
      body_html: issueInput.body_html ?? existing?.body_html,
      body_text: issueInput.body_text ?? existing?.body_text ?? issueInput.body,
      timeline_url:
        issueInput.timeline_url ??
        existing?.timeline_url ??
        `${repoUrl}/issues/${number}/timeline`,
      type: issueInput.type ?? existing?.type,
      repository:
        issueInput.repository ?? existing?.repository ?? state.repository,
      performed_via_github_app:
        issueInput.performed_via_github_app ??
        existing?.performed_via_github_app,
      author_association:
        issueInput.author_association ??
        existing?.author_association ??
        "OWNER",
      reactions: issueInput.reactions ?? existing?.reactions,
      sub_issues_summary:
        issueInput.sub_issues_summary ?? existing?.sub_issues_summary,
      parent_issue_url:
        issueInput.parent_issue_url ?? existing?.parent_issue_url,
      pinned_comment: issueInput.pinned_comment ?? existing?.pinned_comment,
      issue_dependencies_summary:
        issueInput.issue_dependencies_summary ??
        existing?.issue_dependencies_summary,
      issue_field_values:
        issueInput.issue_field_values ?? existing?.issue_field_values,
    };

    state.issues.set(number, nextIssue);
    state.nextIssueNumber = Math.max(state.nextIssueNumber, number + 1);
    this.nextIssueId = Math.max(this.nextIssueId, id + 1);
    this.syncRepoCounts(owner, repo);
    return nextIssue;
  }

  getIssue(
    owner: string,
    repo: string,
    issueNumber: number,
  ): issue | undefined {
    return this.getRepoState(owner, repo)?.issues.get(issueNumber);
  }

  addLabelToIssue(
    owner: string,
    repo: string,
    issueNumber: number,
    names: string[],
  ): label[] {
    const existing = this.getIssue(owner, repo, issueNumber);
    if (!existing) {
      return [];
    }

    const labels = new Map<string, label>();
    for (const item of this.listIssueLabels(owner, repo, issueNumber)) {
      labels.set(item.name, item);
    }
    for (const name of names) {
      const trimmed = name.trim();
      if (!trimmed) {
        continue;
      }
      labels.set(
        trimmed,
        this.getLabel(owner, repo, trimmed) ??
          this.saveLabel(owner, repo, {
            name: trimmed,
            color: "ededed",
          }),
      );
    }

    return this.saveIssue(owner, repo, {
      ...existing,
      number: issueNumber,
      labels: [...labels.values()],
    }).labels as label[];
  }

  removeLabelFromIssue(
    owner: string,
    repo: string,
    issueNumber: number,
    name: string,
  ): boolean {
    const existing = this.getIssue(owner, repo, issueNumber);
    if (!existing) {
      return false;
    }

    const labels = this.listIssueLabels(owner, repo, issueNumber);
    if (!labels.some((item) => item.name === name)) {
      return false;
    }

    this.saveIssue(owner, repo, {
      ...existing,
      number: issueNumber,
      labels: labels.filter((item) => item.name !== name),
    });
    return true;
  }

  replaceIssueLabels(
    owner: string,
    repo: string,
    issueNumber: number,
    names: string[],
  ): label[] {
    const existing = this.getIssue(owner, repo, issueNumber);
    if (!existing) {
      return [];
    }

    const labels = new Map<string, label>();
    for (const name of names) {
      const trimmed = name.trim();
      if (!trimmed) {
        continue;
      }
      labels.set(
        trimmed,
        this.getLabel(owner, repo, trimmed) ??
          this.saveLabel(owner, repo, {
            name: trimmed,
            color: "ededed",
          }),
      );
    }

    return this.saveIssue(owner, repo, {
      ...existing,
      number: issueNumber,
      labels: [...labels.values()],
    }).labels as label[];
  }

  listIssueLabels(
    owner: string,
    repo: string,
    issueNumber: number,
    query?: { page?: unknown; per_page?: unknown },
  ): label[] {
    const issueItem = this.getIssue(owner, repo, issueNumber);
    if (!issueItem) {
      return [];
    }

    return paginate(
      this.resolveIssueLabels(owner, repo, issueItem.labels),
      query,
    );
  }

  listIssues(
    owner: string,
    repo: string,
    query?: {
      state?: string;
      sort?: string;
      direction?: string;
      creator?: string;
      labels?: string;
      page?: unknown;
      per_page?: unknown;
    },
  ) {
    const issues = [...(this.getRepoState(owner, repo)?.issues.values() ?? [])];
    let filtered = issues;

    if (query?.state && query.state !== "all") {
      filtered = filtered.filter(
        (issueItem) => issueItem.state === query.state,
      );
    }
    if (query?.creator) {
      filtered = filtered.filter(
        (issueItem) => issueItem.user?.login === query.creator,
      );
    }
    if (query?.labels) {
      const labels = query.labels
        .split(",")
        .map((label) => label.trim().toLowerCase());
      filtered = filtered.filter((issueItem) =>
        labels.every((label) =>
          issueItem.labels.some((item) =>
            String(typeof item === "string" ? item : (item.name ?? ""))
              .toLowerCase()
              .includes(label),
          ),
        ),
      );
    }

    const direction = query?.direction === "asc" ? 1 : -1;
    filtered.sort((left, right) => {
      if (query?.sort === "comments") {
        return (left.comments - right.comments) * direction;
      }
      if (query?.sort === "created") {
        return (
          (new Date(left.created_at).getTime() -
            new Date(right.created_at).getTime()) *
          direction
        );
      }
      return (
        (new Date(left.updated_at).getTime() -
          new Date(right.updated_at).getTime()) *
        direction
      );
    });

    return paginate(filtered, query);
  }

  saveIssueComment(
    owner: string,
    repo: string,
    issueNumber: number,
    comment: Partial<issue_comment> & { body: string },
  ) {
    const state = this.getRepoState(owner, repo);
    const issueItem = state?.issues.get(issueNumber);
    if (!state || !issueItem) {
      throw new Error(`Issue ${owner}/${repo}#${issueNumber} does not exist`);
    }

    const now = isoNow();
    const comments =
      state.issueComments.get(issueNumber) ?? new Map<number, issue_comment>();
    const id = comment.id ?? this.nextIssueCommentId++;
    const existing = comments.get(id);
    const issueUrl = `${API_URL}/repos/${owner}/${repo}/issues/${issueNumber}`;
    const fullComment: issue_comment = {
      ...(existing ?? {}),
      ...comment,
      id,
      node_id: comment.node_id ?? existing?.node_id ?? `IC_${id}`,
      url: `${API_URL}/repos/${owner}/${repo}/issues/comments/${id}`,
      body: comment.body,
      body_text: comment.body,
      html_url: `${APP_URL}/${owner}/${repo}/issues/${issueNumber}#issuecomment-${id}`,
      user:
        comment.user ??
        existing?.user ??
        toSimpleUser(this.ensureDefaultUser()),
      created_at: existing?.created_at ?? comment.created_at ?? now,
      updated_at: now,
      issue_url: issueUrl,
      author_association:
        comment.author_association ?? existing?.author_association ?? "OWNER",
      performed_via_github_app:
        comment.performed_via_github_app ?? existing?.performed_via_github_app,
      reactions: comment.reactions ?? existing?.reactions,
      pin: comment.pin ?? existing?.pin,
    };

    comments.set(id, fullComment);
    state.issueComments.set(issueNumber, comments);
    issueItem.comments = comments.size;
    this.nextIssueCommentId = Math.max(this.nextIssueCommentId, id + 1);
    return fullComment;
  }

  listIssueComments(
    owner: string,
    repo: string,
    issueNumber: number,
    query?: { page?: unknown; per_page?: unknown },
  ) {
    const comments = [
      ...(this.getRepoState(owner, repo)
        ?.issueComments.get(issueNumber)
        ?.values() ?? []),
    ].sort((left, right) => left.id - right.id);
    return paginate(comments, query);
  }

  savePullRequest(
    owner: string,
    repo: string,
    pullInput: Omit<Partial<pull_request>, "head" | "base"> & {
      head: string | Partial<pull_request["head"]>;
      base: string | Partial<pull_request["base"]>;
      title?: string;
      body?: string;
      number?: number;
    },
  ) {
    const state = this.getRepoState(owner, repo);
    if (!state) {
      throw new Error(`Repository ${owner}/${repo} does not exist`);
    }

    const now = isoNow();
    const number = pullInput.number ?? state.nextPullNumber++;
    const existing = state.pulls.get(number);
    const id = pullInput.id ?? existing?.id ?? this.nextPullId++;
    const author =
      pullInput.user ??
      existing?.user ??
      toSimpleUser(this.ensureDefaultUser());

    // Parse head: can be "branch" or "owner:branch" or an object
    let headRef: string;
    let headOwnerLogin: string | undefined;
    if (typeof pullInput.head === "string") {
      const colonIndex = pullInput.head.indexOf(":");
      if (colonIndex > 0) {
        headOwnerLogin = pullInput.head.substring(0, colonIndex);
        headRef = pullInput.head.substring(colonIndex + 1);
      } else {
        headRef = pullInput.head;
      }
    } else {
      headRef = pullInput.head.ref ?? "feature-branch";
    }

    // Parse base: can be "branch" or "owner:branch" or an object
    let baseRef: string;
    let baseOwnerLogin: string | undefined;
    if (typeof pullInput.base === "string") {
      const colonIndex = pullInput.base.indexOf(":");
      if (colonIndex > 0) {
        baseOwnerLogin = pullInput.base.substring(0, colonIndex);
        baseRef = pullInput.base.substring(colonIndex + 1);
      } else {
        baseRef = pullInput.base;
      }
    } else {
      baseRef = pullInput.base.ref ?? state.repository.default_branch;
    }

    const headRepo =
      typeof pullInput.head === "object" && pullInput.head.repo
        ? pullInput.head.repo
        : state.repository;
    const baseRepo =
      typeof pullInput.base === "object" && pullInput.base.repo
        ? pullInput.base.repo
        : state.repository;
    const headUser =
      typeof pullInput.head === "object" && pullInput.head.user
        ? pullInput.head.user
        : headOwnerLogin
          ? this.ensureUser(headOwnerLogin)
          : author;
    const baseUser =
      typeof pullInput.base === "object" && pullInput.base.user
        ? pullInput.base.user
        : baseOwnerLogin
          ? this.ensureUser(baseOwnerLogin)
          : state.repository.owner;
    const reviewCount =
      state.reviews.get(number)?.size ?? existing?.review_comments ?? 0;
    const sha = hashFor(owner, repo, "pull", number, headRef);

    const pullRequest: pull_request = {
      ...(existing ?? {}),
      ...pullInput,
      url: `${API_URL}/repos/${owner}/${repo}/pulls/${number}`,
      id,
      node_id: pullInput.node_id ?? existing?.node_id ?? `PR_${id}`,
      html_url: `${APP_URL}/${owner}/${repo}/pull/${number}`,
      diff_url: `${APP_URL}/${owner}/${repo}/pull/${number}.diff`,
      patch_url: `${APP_URL}/${owner}/${repo}/pull/${number}.patch`,
      issue_url: `${API_URL}/repos/${owner}/${repo}/issues/${number}`,
      commits_url: `${API_URL}/repos/${owner}/${repo}/pulls/${number}/commits`,
      review_comments_url: `${API_URL}/repos/${owner}/${repo}/pulls/${number}/comments`,
      review_comment_url: `${API_URL}/repos/${owner}/${repo}/pulls/comments{/number}`,
      comments_url: `${API_URL}/repos/${owner}/${repo}/issues/${number}/comments`,
      statuses_url: `${API_URL}/repos/${owner}/${repo}/statuses/${sha}`,
      number,
      state: pullInput.state ?? existing?.state ?? "open",
      locked: pullInput.locked ?? existing?.locked ?? false,
      title: pullInput.title ?? existing?.title ?? `Pull request ${number}`,
      user: author,
      body: pullInput.body ?? existing?.body ?? "",
      labels: pullInput.labels ?? existing?.labels ?? [],
      milestone: pullInput.milestone ?? existing?.milestone ?? null,
      active_lock_reason:
        pullInput.active_lock_reason ?? existing?.active_lock_reason,
      created_at: existing?.created_at ?? pullInput.created_at ?? now,
      updated_at: now,
      closed_at:
        pullInput.state === "closed"
          ? (pullInput.closed_at ?? existing?.closed_at ?? now)
          : (pullInput.closed_at ?? existing?.closed_at ?? ""),
      merged_at: pullInput.merged_at ?? existing?.merged_at ?? "",
      merge_commit_sha:
        pullInput.merge_commit_sha ??
        existing?.merge_commit_sha ??
        hashFor(owner, repo, number, "merge"),
      assignee: pullInput.assignee ?? existing?.assignee ?? null,
      assignees: pullInput.assignees ?? existing?.assignees ?? [],
      requested_reviewers:
        pullInput.requested_reviewers ?? existing?.requested_reviewers ?? [],
      requested_teams:
        pullInput.requested_teams ?? existing?.requested_teams ?? [],
      head: {
        label:
          (typeof pullInput.head === "object"
            ? pullInput.head.label
            : undefined) ??
          existing?.head.label ??
          `${headUser.login}:${headRef}`,
        ref: headRef,
        repo: headRepo,
        sha:
          (typeof pullInput.head === "object"
            ? pullInput.head.sha
            : undefined) ??
          existing?.head.sha ??
          sha,
        user: headUser,
      },
      base: {
        label:
          (typeof pullInput.base === "object"
            ? pullInput.base.label
            : undefined) ??
          existing?.base.label ??
          `${baseRepo.full_name}:${baseRef}`,
        ref: baseRef,
        repo: baseRepo,
        sha:
          (typeof pullInput.base === "object"
            ? pullInput.base.sha
            : undefined) ??
          existing?.base.sha ??
          hashFor(owner, repo, baseRef),
        user: baseUser,
      },
      _links: {
        comments: {
          href: `${API_URL}/repos/${owner}/${repo}/issues/${number}/comments`,
        },
        commits: {
          href: `${API_URL}/repos/${owner}/${repo}/pulls/${number}/commits`,
        },
        statuses: { href: `${API_URL}/repos/${owner}/${repo}/statuses/${sha}` },
        html: { href: `${APP_URL}/${owner}/${repo}/pull/${number}` },
        issue: { href: `${API_URL}/repos/${owner}/${repo}/issues/${number}` },
        review_comments: {
          href: `${API_URL}/repos/${owner}/${repo}/pulls/${number}/comments`,
        },
        review_comment: {
          href: `${API_URL}/repos/${owner}/${repo}/pulls/comments{/number}`,
        },
        self: { href: `${API_URL}/repos/${owner}/${repo}/pulls/${number}` },
      },
      author_association:
        pullInput.author_association ?? existing?.author_association ?? "OWNER",
      auto_merge: pullInput.auto_merge ?? existing?.auto_merge ?? (null as any),
      draft: pullInput.draft ?? existing?.draft ?? false,
      merged: pullInput.merged ?? existing?.merged ?? false,
      mergeable: pullInput.mergeable ?? existing?.mergeable ?? true,
      rebaseable: pullInput.rebaseable ?? existing?.rebaseable ?? true,
      mergeable_state:
        pullInput.mergeable_state ?? existing?.mergeable_state ?? "clean",
      merged_by: pullInput.merged_by ?? existing?.merged_by ?? null,
      comments: pullInput.comments ?? existing?.comments ?? 0,
      review_comments: reviewCount,
      maintainer_can_modify:
        pullInput.maintainer_can_modify ??
        existing?.maintainer_can_modify ??
        true,
      commits: pullInput.commits ?? existing?.commits ?? 1,
      additions: pullInput.additions ?? existing?.additions ?? 10,
      deletions: pullInput.deletions ?? existing?.deletions ?? 2,
      changed_files: pullInput.changed_files ?? existing?.changed_files ?? 1,
    };

    state.pulls.set(number, pullRequest);
    state.nextPullNumber = Math.max(state.nextPullNumber, number + 1);
    this.nextPullId = Math.max(this.nextPullId, id + 1);
    return pullRequest;
  }

  getPullRequest(owner: string, repo: string, pullNumber: number) {
    return this.getRepoState(owner, repo)?.pulls.get(pullNumber);
  }

  listPullRequests(
    owner: string,
    repo: string,
    query?: {
      state?: string;
      base?: string;
      head?: string;
      sort?: string;
      direction?: string;
      page?: unknown;
      per_page?: unknown;
    },
  ) {
    let pulls = [...(this.getRepoState(owner, repo)?.pulls.values() ?? [])];

    if (query?.state && query.state !== "all") {
      pulls = pulls.filter((pull) => pull.state === query.state);
    }
    if (query?.base) {
      pulls = pulls.filter((pull) => pull.base.ref === query.base);
    }
    if (query?.head) {
      pulls = pulls.filter((pull) => pull.head.label === query.head);
    }

    const direction = query?.direction === "asc" ? 1 : -1;
    pulls.sort((left, right) => {
      if (query?.sort === "updated") {
        return (
          (new Date(left.updated_at).getTime() -
            new Date(right.updated_at).getTime()) *
          direction
        );
      }
      return (
        (new Date(left.created_at).getTime() -
          new Date(right.created_at).getTime()) *
        direction
      );
    });

    return paginate(pulls, query);
  }

  savePullRequestReview(
    owner: string,
    repo: string,
    pullNumber: number,
    review: Partial<pull_request_review> & { body?: string; state?: string },
  ) {
    const state = this.getRepoState(owner, repo);
    const pullRequest = state?.pulls.get(pullNumber);
    if (!state || !pullRequest) {
      throw new Error(
        `Pull request ${owner}/${repo}#${pullNumber} does not exist`,
      );
    }

    const now = isoNow();
    const reviews =
      state.reviews.get(pullNumber) ?? new Map<number, pull_request_review>();
    const id = review.id ?? this.nextReviewId++;
    const existing = reviews.get(id);
    const fullReview: pull_request_review = {
      ...(existing ?? {}),
      ...review,
      id,
      node_id: review.node_id ?? existing?.node_id ?? `RV_${id}`,
      user:
        review.user ?? existing?.user ?? toSimpleUser(this.ensureDefaultUser()),
      body: review.body ?? existing?.body ?? "",
      state: review.state ?? existing?.state ?? "COMMENTED",
      html_url: `${APP_URL}/${owner}/${repo}/pull/${pullNumber}#pullrequestreview-${id}`,
      pull_request_url: `${API_URL}/repos/${owner}/${repo}/pulls/${pullNumber}`,
      _links: {
        html: {
          href: `${APP_URL}/${owner}/${repo}/pull/${pullNumber}#pullrequestreview-${id}`,
        },
        pull_request: {
          href: `${API_URL}/repos/${owner}/${repo}/pulls/${pullNumber}`,
        },
      },
      submitted_at: review.submitted_at ?? existing?.submitted_at ?? now,
      commit_id:
        review.commit_id ?? existing?.commit_id ?? pullRequest.head.sha,
      body_html: review.body_html ?? existing?.body_html,
      body_text: review.body_text ?? existing?.body_text ?? review.body,
      author_association:
        review.author_association ?? existing?.author_association ?? "OWNER",
    };

    reviews.set(id, fullReview);
    state.reviews.set(pullNumber, reviews);
    pullRequest.review_comments = reviews.size;
    this.nextReviewId = Math.max(this.nextReviewId, id + 1);
    return fullReview;
  }

  listPullRequestReviews(
    owner: string,
    repo: string,
    pullNumber: number,
    query?: { page?: unknown; per_page?: unknown },
  ) {
    const reviews = [
      ...(this.getRepoState(owner, repo)?.reviews.get(pullNumber)?.values() ??
        []),
    ].sort((left, right) => left.id - right.id);
    return paginate(reviews, query);
  }

  saveWorkflow(
    owner: string,
    repo: string,
    workflowInput: Partial<workflow> & { name: string; path: string },
  ) {
    const state = this.getRepoState(owner, repo);
    if (!state) {
      throw new Error(`Repository ${owner}/${repo} does not exist`);
    }

    const now = isoNow();
    const id = workflowInput.id ?? this.nextWorkflowId++;
    const saved: workflow = {
      ...workflowInput,
      id,
      node_id: workflowInput.node_id ?? `WF_${id}`,
      name: workflowInput.name,
      path: workflowInput.path,
      state: workflowInput.state ?? "active",
      created_at: workflowInput.created_at ?? now,
      updated_at: workflowInput.updated_at ?? now,
      url: `${API_URL}/repos/${owner}/${repo}/actions/workflows/${id}`,
      html_url: `${APP_URL}/${owner}/${repo}/blob/main/${workflowInput.path}`,
      badge_url: `${APP_URL}/${owner}/${repo}/actions/workflows/${id}/badge.svg`,
      deleted_at: workflowInput.deleted_at,
    };
    state.workflows.set(id, saved);
    this.nextWorkflowId = Math.max(this.nextWorkflowId, id + 1);
    return saved;
  }

  listWorkflows(
    owner: string,
    repo: string,
    query?: { page?: unknown; per_page?: unknown },
  ) {
    const workflows = [
      ...(this.getRepoState(owner, repo)?.workflows.values() ?? []),
    ].sort((left, right) => left.id - right.id);
    return paginate(workflows, query);
  }

  saveWorkflowRun(
    owner: string,
    repo: string,
    runInput: Partial<workflow_run> & {
      workflow_id: number;
      head_branch: string;
      event: string;
      status: string;
      conclusion: string;
      display_title: string;
    },
  ) {
    const state = this.getRepoState(owner, repo);
    const workflowItem = state?.workflows.get(runInput.workflow_id);
    if (!state || !workflowItem) {
      throw new Error(
        `Workflow ${runInput.workflow_id} for ${owner}/${repo} does not exist`,
      );
    }

    const now = isoNow();
    const id = runInput.id ?? this.nextRunId++;
    const actor = runInput.actor ?? toSimpleUser(this.ensureDefaultUser());
    const run: workflow_run = {
      ...runInput,
      id,
      name: runInput.name ?? workflowItem.name,
      node_id: runInput.node_id ?? `WR_${id}`,
      check_suite_id: runInput.check_suite_id ?? id + 100,
      check_suite_node_id: runInput.check_suite_node_id ?? `CS_${id}`,
      head_branch: runInput.head_branch,
      head_sha:
        runInput.head_sha ?? hashFor(owner, repo, runInput.head_branch, id),
      path:
        runInput.path ??
        `${owner}/${repo}/${workflowItem.path}@${runInput.head_branch}`,
      run_number: runInput.run_number ?? id - 6999,
      run_attempt: runInput.run_attempt ?? 1,
      event: runInput.event,
      status: runInput.status,
      conclusion: runInput.conclusion,
      workflow_id: runInput.workflow_id,
      url: `${API_URL}/repos/${owner}/${repo}/actions/runs/${id}`,
      html_url: `${APP_URL}/${owner}/${repo}/actions/runs/${id}`,
      pull_requests: runInput.pull_requests ?? [],
      created_at: runInput.created_at ?? now,
      updated_at: runInput.updated_at ?? now,
      actor,
      triggering_actor: runInput.triggering_actor ?? actor,
      run_started_at: runInput.run_started_at ?? now,
      jobs_url: `${API_URL}/repos/${owner}/${repo}/actions/runs/${id}/jobs`,
      logs_url: `${API_URL}/repos/${owner}/${repo}/actions/runs/${id}/logs`,
      check_suite_url: `${API_URL}/repos/${owner}/${repo}/check-suites/${id + 100}`,
      artifacts_url: `${API_URL}/repos/${owner}/${repo}/actions/runs/${id}/artifacts`,
      cancel_url: `${API_URL}/repos/${owner}/${repo}/actions/runs/${id}/cancel`,
      rerun_url: `${API_URL}/repos/${owner}/${repo}/actions/runs/${id}/rerun`,
      previous_attempt_url: runInput.previous_attempt_url,
      workflow_url: `${API_URL}/repos/${owner}/${repo}/actions/workflows/${workflowItem.id}`,
      head_commit: runInput.head_commit ?? {
        id: runInput.head_sha ?? hashFor(owner, repo, runInput.head_branch, id),
        tree_id: hashFor(owner, repo, runInput.head_branch, "tree", id),
        message: runInput.display_title,
        timestamp: now,
        author: {
          name: actor.name ?? actor.login,
          email: actor.email ?? `${actor.login}@example.com`,
        },
        committer: {
          name: actor.name ?? actor.login,
          email: actor.email ?? `${actor.login}@example.com`,
        },
      },
      repository: { ...state.repository },
      head_repository: { ...state.repository },
      head_repository_id: runInput.head_repository_id ?? state.repository.id,
      display_title: runInput.display_title,
    };

    state.runs.set(id, run);
    this.nextRunId = Math.max(this.nextRunId, id + 1);
    return run;
  }

  listWorkflowRuns(
    owner: string,
    repo: string,
    query?: {
      actor?: string;
      branch?: string;
      event?: string;
      status?: string;
      page?: unknown;
      per_page?: unknown;
    },
  ) {
    let runs = [...(this.getRepoState(owner, repo)?.runs.values() ?? [])];
    if (query?.actor) {
      runs = runs.filter((run) => run.actor?.login === query.actor);
    }
    if (query?.branch) {
      runs = runs.filter((run) => run.head_branch === query.branch);
    }
    if (query?.event) {
      runs = runs.filter((run) => run.event === query.event);
    }
    if (query?.status) {
      runs = runs.filter(
        (run) => run.status === query.status || run.conclusion === query.status,
      );
    }
    runs.sort((left, right) => right.id - left.id);
    return paginate(runs, query);
  }

  saveWorkflowJob(
    owner: string,
    repo: string,
    runId: number,
    jobInput: Partial<job> & {
      name: string;
      status: job["status"];
      conclusion: job["conclusion"];
    },
  ) {
    const state = this.getRepoState(owner, repo);
    const run = state?.runs.get(runId);
    if (!state || !run) {
      throw new Error(
        `Workflow run ${runId} for ${owner}/${repo} does not exist`,
      );
    }

    const now = isoNow();
    const id = jobInput.id ?? this.nextJobId++;
    const jobs = state.jobs.get(runId) ?? [];
    const fullJob: job = {
      ...jobInput,
      id,
      run_id: runId,
      run_url: `${API_URL}/repos/${owner}/${repo}/actions/runs/${runId}`,
      run_attempt: jobInput.run_attempt ?? 1,
      node_id: jobInput.node_id ?? `JOB_${id}`,
      head_sha: jobInput.head_sha ?? run.head_sha,
      url: `${API_URL}/repos/${owner}/${repo}/actions/jobs/${id}`,
      html_url: `${APP_URL}/${owner}/${repo}/actions/runs/${runId}/job/${id}`,
      status: jobInput.status,
      conclusion: jobInput.conclusion,
      created_at: jobInput.created_at ?? now,
      started_at: jobInput.started_at ?? now,
      completed_at: jobInput.completed_at ?? now,
      name: jobInput.name,
      steps: jobInput.steps ?? [
        {
          status: "completed",
          conclusion: jobInput.conclusion,
          name: `${jobInput.name} step`,
          number: 1,
          started_at: now,
          completed_at: now,
        },
      ],
      check_run_url: `${API_URL}/repos/${owner}/${repo}/check-runs/${id}`,
      labels: jobInput.labels ?? ["ubuntu-latest"],
      runner_id: jobInput.runner_id ?? 1,
      runner_name: jobInput.runner_name ?? "counterfact-runner",
      runner_group_id: jobInput.runner_group_id ?? 1,
      runner_group_name: jobInput.runner_group_name ?? "default",
      workflow_name: jobInput.workflow_name ?? run.name ?? "CI",
      head_branch: jobInput.head_branch ?? run.head_branch,
    };

    jobs.push(fullJob);
    state.jobs.set(runId, jobs);
    this.nextJobId = Math.max(this.nextJobId, id + 1);
    return fullJob;
  }

  listWorkflowJobs(
    owner: string,
    repo: string,
    runId: number,
    query?: { filter?: string; page?: unknown; per_page?: unknown },
  ) {
    const jobs = [
      ...(this.getRepoState(owner, repo)?.jobs.get(runId) ?? []),
    ].sort((left, right) => left.id - right.id);
    return paginate(jobs, query);
  }

  searchRepositories(query: {
    q: string;
    sort?: string;
    order?: string;
    page?: unknown;
    per_page?: unknown;
  }) {
    const parsed = parseSearchQuery(query.q);
    let repositories = this.listRepositories().filter((repository) => {
      const haystack = [
        repository.name,
        repository.full_name,
        repository.description,
      ]
        .join(" ")
        .toLowerCase();
      return (
        matchTerms(haystack, parsed.terms) &&
        hasQualifier(
          parsed.qualifiers,
          "repo",
          (value) => repository.full_name.toLowerCase() === value,
        ) &&
        hasQualifier(
          parsed.qualifiers,
          "org",
          (value) => repository.owner.login.toLowerCase() === value,
        ) &&
        hasQualifier(
          parsed.qualifiers,
          "user",
          (value) => repository.owner.login.toLowerCase() === value,
        ) &&
        hasQualifier(
          parsed.qualifiers,
          "language",
          (value) => repository.language.toLowerCase() === value,
        )
      );
    });

    const direction = query.order === "asc" ? 1 : -1;
    repositories.sort((left, right) => {
      if (query.sort === "stars") {
        return (left.stargazers_count - right.stargazers_count) * direction;
      }
      if (query.sort === "updated") {
        return (
          (new Date(left.updated_at).getTime() -
            new Date(right.updated_at).getTime()) *
          direction
        );
      }
      return left.full_name.localeCompare(right.full_name) * direction;
    });

    const items = paginate(repositories, query).map((repository) => ({
      ...repository,
      score: 1,
    }));

    return {
      total_count: repositories.length,
      incomplete_results: false,
      items,
    };
  }

  searchIssuesAndPullRequests(query: {
    q: string;
    sort?: string;
    order?: string;
    page?: unknown;
    per_page?: unknown;
  }) {
    const parsed = parseSearchQuery(query.q);
    const wantPrs = parsed.qualifiers
      .get("is")
      ?.some((value) => ["pr", "pull", "pull-request"].includes(value));
    const wantIssues = parsed.qualifiers
      .get("is")
      ?.some((value) => value === "issue");
    const includeIssues = wantIssues || !wantPrs;
    const includePulls = wantPrs || !wantIssues;

    const issueItems = includeIssues
      ? this.listRepositories().flatMap((repository) =>
          this.listIssues(repository.owner.login, repository.name, {
            state: "all",
          }).map((issueItem) => ({ ...issueItem, score: 1 })),
        )
      : [];

    const pullItems = includePulls
      ? this.listRepositories().flatMap((repository) =>
          this.listPullRequests(repository.owner.login, repository.name, {
            state: "all",
          }).map((pull) => ({
            url: pull.issue_url,
            repository_url: pull.base.repo.url,
            labels_url: `${pull.issue_url}/labels{/name}`,
            comments_url: pull.comments_url,
            events_url: `${pull.issue_url}/events`,
            html_url: pull.html_url,
            id: pull.id,
            node_id: pull.node_id,
            number: pull.number,
            title: pull.title,
            locked: pull.locked,
            active_lock_reason: pull.active_lock_reason,
            assignees: pull.assignees,
            user: pull.user,
            labels: pull.labels,
            state: pull.state,
            assignee: pull.assignee,
            milestone: pull.milestone,
            comments: pull.comments,
            created_at: pull.created_at,
            updated_at: pull.updated_at,
            closed_at: pull.closed_at,
            pull_request: {
              diff_url: pull.diff_url,
              html_url: pull.html_url,
              patch_url: pull.patch_url,
              url: pull.url,
              merged_at: pull.merged_at || undefined,
            },
            body: pull.body,
            score: 1,
            author_association: pull.author_association,
            draft: pull.draft,
            repository: pull.base.repo,
          })),
        )
      : [];

    let items = [...issueItems, ...pullItems].filter((item) => {
      const haystack = [
        item.title,
        item.body ?? "",
        item.repository?.full_name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return (
        matchTerms(haystack, parsed.terms) &&
        hasQualifier(
          parsed.qualifiers,
          "repo",
          (value) => item.repository?.full_name.toLowerCase() === value,
        ) &&
        hasQualifier(
          parsed.qualifiers,
          "org",
          (value) => item.repository?.owner.login.toLowerCase() === value,
        ) &&
        hasQualifier(
          parsed.qualifiers,
          "user",
          (value) => item.repository?.owner.login.toLowerCase() === value,
        ) &&
        hasQualifier(
          parsed.qualifiers,
          "state",
          (value) => item.state.toLowerCase() === value,
        ) &&
        hasQualifier(
          parsed.qualifiers,
          "author",
          (value) => item.user?.login?.toLowerCase() === value,
        )
      );
    });

    const direction = query.order === "asc" ? 1 : -1;
    items.sort((left, right) => {
      if (query.sort === "created") {
        return (
          (new Date(left.created_at).getTime() -
            new Date(right.created_at).getTime()) *
          direction
        );
      }
      if (query.sort === "comments") {
        return (left.comments - right.comments) * direction;
      }
      return (
        (new Date(left.updated_at).getTime() -
          new Date(right.updated_at).getTime()) *
        direction
      );
    });

    const pagedItems = paginate(items, query);
    return {
      total_count: items.length,
      incomplete_results: false,
      items: pagedItems,
      search_type: "lexical" as const,
    };
  }

  saveRelease(
    owner: string,
    repo: string,
    releaseInput: Partial<release> & { tag_name: string },
  ): release {
    const state = this.getRepoState(owner, repo);
    if (!state) {
      throw new Error(`Repository ${owner}/${repo} does not exist`);
    }

    const now = isoNow();
    const id = releaseInput.id ?? state.nextReleaseId++;
    const existing = state.releases.get(id);
    const author =
      releaseInput.author ??
      existing?.author ??
      toSimpleUser(this.ensureDefaultUser());
    const repoUrl = `${API_URL}/repos/${owner}/${repo}`;
    const releaseUrl = `${repoUrl}/releases/${id}`;

    const fullRelease: release = {
      ...(existing ?? {}),
      ...releaseInput,
      id,
      node_id: releaseInput.node_id ?? existing?.node_id ?? `RE_${id}`,
      url: releaseUrl,
      html_url: `${APP_URL}/${owner}/${repo}/releases/tag/${releaseInput.tag_name}`,
      assets_url: `${releaseUrl}/assets`,
      upload_url: `https://uploads.github.com/repos/${owner}/${repo}/releases/${id}/assets{?name,label}`,
      tarball_url: `${APP_URL}/${owner}/${repo}/archive/${releaseInput.tag_name}.tar.gz`,
      zipball_url: `${APP_URL}/${owner}/${repo}/archive/${releaseInput.tag_name}.zip`,
      tag_name: releaseInput.tag_name,
      target_commitish:
        releaseInput.target_commitish ??
        existing?.target_commitish ??
        state.repository.default_branch,
      name: releaseInput.name ?? existing?.name ?? releaseInput.tag_name,
      body: releaseInput.body ?? existing?.body ?? "",
      draft: releaseInput.draft ?? existing?.draft ?? false,
      prerelease: releaseInput.prerelease ?? existing?.prerelease ?? false,
      created_at: existing?.created_at ?? releaseInput.created_at ?? now,
      published_at:
        (releaseInput.draft ?? existing?.draft ?? false)
          ? (releaseInput.published_at ?? existing?.published_at ?? "")
          : (releaseInput.published_at ?? existing?.published_at ?? now),
      author,
      assets: releaseInput.assets ?? existing?.assets ?? [],
    };

    state.releases.set(id, fullRelease);
    state.nextReleaseId = Math.max(state.nextReleaseId, id + 1);
    return fullRelease;
  }

  getRelease(owner: string, repo: string, id: number): release | undefined {
    return this.getRepoState(owner, repo)?.releases.get(id);
  }

  getReleaseByTag(
    owner: string,
    repo: string,
    tag: string,
  ): release | undefined {
    return [...(this.getRepoState(owner, repo)?.releases.values() ?? [])].find(
      (r) => r.tag_name === tag,
    );
  }

  getLatestRelease(owner: string, repo: string): release | undefined {
    const candidates = [
      ...(this.getRepoState(owner, repo)?.releases.values() ?? []),
    ].filter((r) => !r.draft && !r.prerelease && r.published_at);
    if (candidates.length === 0) return undefined;
    return candidates.reduce((latest, current) =>
      new Date(current.created_at).getTime() >
      new Date(latest.created_at).getTime()
        ? current
        : latest,
    );
  }

  updateRelease(
    owner: string,
    repo: string,
    id: number,
    patch: Partial<release>,
  ): release | undefined {
    const existing = this.getRelease(owner, repo, id);
    if (!existing) return undefined;
    return this.saveRelease(owner, repo, {
      ...existing,
      ...patch,
      id,
      tag_name: patch.tag_name ?? existing.tag_name,
    });
  }

  deleteRelease(owner: string, repo: string, id: number): boolean {
    return this.getRepoState(owner, repo)?.releases.delete(id) ?? false;
  }

  listReleases(
    owner: string,
    repo: string,
    query?: { page?: unknown; per_page?: unknown },
  ): release[] {
    const releases = [
      ...(this.getRepoState(owner, repo)?.releases.values() ?? []),
    ].sort(
      (left, right) =>
        new Date(right.created_at).getTime() -
        new Date(left.created_at).getTime(),
    );
    return paginate(releases, query);
  }
}

import type { Context$ } from "../../types/_.context.js";
import type { organization_full } from "../../types/components/schemas/organization-full.js";
import type { organization_simple } from "../../types/components/schemas/organization-simple.js";
import type { public_user } from "../../types/components/schemas/public-user.js";
import type { simple_user } from "../../types/components/schemas/simple-user.js";
import type { user_search_result_item } from "../../types/components/schemas/user-search-result-item.js";

const API_URL = "https://api.github.com";
const APP_URL = "https://github.com";
const DEFAULT_PAGE_SIZE = 30;

const isoNow = () => new Date().toISOString();

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

const makePublicUser = (
  login: string,
  id: number,
  overrides: Partial<public_user> = {},
): public_user => {
  const simple = makeSimpleUser(
    login,
    id,
    overrides.type ?? "User",
    overrides.name,
  );
  const now = isoNow();

  return {
    ...simple,
    user_view_type: overrides.user_view_type ?? "public",
    name: overrides.name ?? login,
    company: overrides.company ?? "Counterfact",
    blog: overrides.blog ?? "",
    location: overrides.location ?? "Internet",
    email: overrides.email ?? `${login}@example.com`,
    notification_email: overrides.notification_email ?? `${login}@example.com`,
    hireable: overrides.hireable ?? false,
    bio: overrides.bio ?? `Sample profile for ${login}`,
    twitter_username: overrides.twitter_username,
    public_repos: overrides.public_repos ?? 0,
    public_gists: overrides.public_gists ?? 0,
    followers: overrides.followers ?? 0,
    following: overrides.following ?? 0,
    created_at: overrides.created_at ?? now,
    updated_at: overrides.updated_at ?? now,
    plan: overrides.plan,
    private_gists: overrides.private_gists,
    total_private_repos: overrides.total_private_repos,
    owned_private_repos: overrides.owned_private_repos,
    disk_usage: overrides.disk_usage,
    collaborators: overrides.collaborators,
  };
};

const makeOrganization = (
  login: string,
  id: number,
  overrides: Partial<organization_full> = {},
): organization_full => ({
  login,
  id,
  node_id: overrides.node_id ?? `O_${id}`,
  url: `${API_URL}/orgs/${login}`,
  repos_url: `${API_URL}/orgs/${login}/repos`,
  events_url: `${API_URL}/orgs/${login}/events`,
  hooks_url: `${API_URL}/orgs/${login}/hooks`,
  issues_url: `${API_URL}/orgs/${login}/issues`,
  members_url: `${API_URL}/orgs/${login}/members{/member}`,
  public_members_url: `${API_URL}/orgs/${login}/public_members{/member}`,
  avatar_url: `${APP_URL}/${login}.png`,
  description: overrides.description ?? `${login} organization`,
  name: overrides.name ?? login,
  company: overrides.company ?? login,
  blog: overrides.blog ?? "",
  location: overrides.location ?? "Internet",
  email: overrides.email ?? `${login}@example.com`,
  twitter_username: overrides.twitter_username,
  is_verified: overrides.is_verified ?? true,
  has_organization_projects: overrides.has_organization_projects ?? true,
  has_repository_projects: overrides.has_repository_projects ?? true,
  public_repos: overrides.public_repos ?? 0,
  public_gists: overrides.public_gists ?? 0,
  followers: overrides.followers ?? 0,
  following: overrides.following ?? 0,
  html_url: `${APP_URL}/orgs/${login}`,
  type: "Organization",
  total_private_repos: overrides.total_private_repos ?? 0,
  owned_private_repos: overrides.owned_private_repos ?? 0,
  private_gists: overrides.private_gists ?? 0,
  disk_usage: overrides.disk_usage ?? 0,
  collaborators: overrides.collaborators ?? 0,
  billing_email: overrides.billing_email ?? `${login}@example.com`,
  plan: overrides.plan,
  default_repository_permission:
    overrides.default_repository_permission ?? "write",
  default_repository_branch: overrides.default_repository_branch ?? "main",
  members_can_create_repositories:
    overrides.members_can_create_repositories ?? true,
  two_factor_requirement_enabled:
    overrides.two_factor_requirement_enabled ?? false,
  members_allowed_repository_creation_type:
    overrides.members_allowed_repository_creation_type ?? "all",
  members_can_create_public_repositories:
    overrides.members_can_create_public_repositories ?? true,
  members_can_create_private_repositories:
    overrides.members_can_create_private_repositories ?? true,
  members_can_create_internal_repositories:
    overrides.members_can_create_internal_repositories ?? true,
  members_can_create_pages: overrides.members_can_create_pages ?? true,
  members_can_create_public_pages:
    overrides.members_can_create_public_pages ?? true,
  members_can_create_private_pages:
    overrides.members_can_create_private_pages ?? true,
  members_can_delete_repositories:
    overrides.members_can_delete_repositories ?? true,
  members_can_change_repo_visibility:
    overrides.members_can_change_repo_visibility ?? true,
  members_can_invite_outside_collaborators:
    overrides.members_can_invite_outside_collaborators ?? true,
  members_can_delete_issues: overrides.members_can_delete_issues ?? true,
  display_commenter_full_name_setting_enabled:
    overrides.display_commenter_full_name_setting_enabled ?? false,
  readers_can_create_discussions:
    overrides.readers_can_create_discussions ?? true,
});

const organizationToSimple = (
  organization: organization_full,
): organization_simple => ({
  login: organization.login,
  id: organization.id,
  node_id: organization.node_id,
  url: organization.url,
  repos_url: organization.repos_url,
  events_url: organization.events_url,
  hooks_url: organization.hooks_url,
  issues_url: organization.issues_url,
  members_url: organization.members_url,
  public_members_url: organization.public_members_url,
  avatar_url: organization.avatar_url,
  description: organization.description,
});

export const toSimpleUser = (user: public_user): simple_user => ({
  name: user.name,
  email: user.email,
  login: user.login,
  id: user.id,
  node_id: user.node_id,
  avatar_url: user.avatar_url,
  gravatar_id: user.gravatar_id,
  url: user.url,
  html_url: user.html_url,
  followers_url: user.followers_url,
  following_url: user.following_url,
  gists_url: user.gists_url,
  starred_url: user.starred_url,
  subscriptions_url: user.subscriptions_url,
  organizations_url: user.organizations_url,
  repos_url: user.repos_url,
  events_url: user.events_url,
  received_events_url: user.received_events_url,
  type: user.type,
  site_admin: user.site_admin,
  user_view_type: user.user_view_type,
});

type RootContext = {
  listRepositories(): Array<{ owner: { login: string }; private: boolean }>;
};

export class Context {
  private usersByLogin = new Map<string, public_user>();
  private orgsByLogin = new Map<string, organization_full>();
  private nextUserId = 100;
  private nextOrgId = 500;

  constructor(private readonly $: Context$) {}

  private rootContext(): RootContext {
    return this.$.loadContext("/");
  }

  saveUser(user: Partial<public_user> & { login: string }): public_user {
    const existing = this.usersByLogin.get(user.login);
    const id = user.id ?? existing?.id ?? this.nextUserId++;
    const fullUser = makePublicUser(user.login, id, { ...existing, ...user });
    this.usersByLogin.set(fullUser.login, fullUser);
    this.nextUserId = Math.max(this.nextUserId, id + 1);
    return this.getUser(fullUser.login)!;
  }

  getUser(login: string): public_user | undefined {
    const user = this.usersByLogin.get(login);
    if (!user) return undefined;

    const repositories = this.rootContext()
      .listRepositories()
      .filter((repository) => repository.owner.login === login);

    return {
      ...user,
      public_repos: repositories.filter((repository) => !repository.private)
        .length,
      total_private_repos: repositories.filter(
        (repository) => repository.private,
      ).length,
      owned_private_repos: repositories.filter(
        (repository) => repository.private,
      ).length,
      updated_at: isoNow(),
    };
  }

  listUsers(query?: {
    since?: unknown;
    per_page?: unknown;
  }): Array<public_user> {
    const users = [...this.usersByLogin.keys()]
      .map((login) => this.getUser(login)!)
      .sort((left, right) => left.id - right.id);
    const filtered =
      query?.since == null
        ? users
        : users.filter((user) => user.id > Number(query.since));
    return paginate(filtered, query);
  }

  listSimpleUsers(query?: {
    since?: unknown;
    per_page?: unknown;
  }): Array<simple_user> {
    return this.listUsers(query).map((user) => toSimpleUser(user));
  }

  searchUsers(query: {
    q: string;
    order?: string;
    page?: unknown;
    per_page?: unknown;
  }) {
    const terms = query.q
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term && !term.includes(":"));
    const userItems: user_search_result_item[] = this.listUsers().map(
      (user) => ({ ...user, score: 1 }),
    );
    const organizationItems: user_search_result_item[] =
      this.listOrganizations().map((organization) => ({
        ...makeSimpleUser(
          organization.login,
          organization.id,
          "Organization",
          organization.name,
        ),
        score: 1,
        public_repos: organization.public_repos,
        public_gists: organization.public_gists,
        followers: organization.followers,
        following: organization.following,
        name: organization.name,
        email: organization.email,
        location: organization.location,
        blog: organization.blog,
        company: organization.company,
      }));
    let items = [...userItems, ...organizationItems].filter((item) => {
      const haystack = [
        item.login,
        item.name ?? "",
        item.bio ?? "",
        item.email ?? "",
        item.company ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
    const direction = query.order === "asc" ? 1 : -1;
    items = items.sort(
      (left, right) => left.login.localeCompare(right.login) * direction,
    );
    return {
      total_count: items.length,
      incomplete_results: false,
      items: paginate(items, query),
    };
  }

  saveOrganization(
    organization: Partial<organization_full> & { login: string },
  ): organization_full {
    const existing = this.orgsByLogin.get(organization.login);
    const id = organization.id ?? existing?.id ?? this.nextOrgId++;
    const fullOrganization = makeOrganization(organization.login, id, {
      ...existing,
      ...organization,
    });
    this.orgsByLogin.set(fullOrganization.login, fullOrganization);
    this.nextOrgId = Math.max(this.nextOrgId, id + 1);
    return this.getOrganization(fullOrganization.login)!;
  }

  getOrganization(login: string): organization_full | undefined {
    const organization = this.orgsByLogin.get(login);
    if (!organization) return undefined;

    const repositories = this.rootContext()
      .listRepositories()
      .filter((repository) => repository.owner.login === login);

    return {
      ...organization,
      public_repos: repositories.filter((repository) => !repository.private)
        .length,
      total_private_repos: repositories.filter(
        (repository) => repository.private,
      ).length,
      owned_private_repos: repositories.filter(
        (repository) => repository.private,
      ).length,
      updated_at: isoNow(),
    } as organization_full & { updated_at: string };
  }

  listOrganizations(query?: { since?: unknown; per_page?: unknown }) {
    const organizations = [...this.orgsByLogin.keys()]
      .map((login) => this.getOrganization(login)!)
      .sort((left, right) => left.id - right.id);
    const filtered =
      query?.since == null
        ? organizations
        : organizations.filter(
            (organization) => organization.id > Number(query.since),
          );
    return paginate(filtered, query);
  }

  listSimpleOrganizations(query?: { since?: unknown; per_page?: unknown }) {
    return this.listOrganizations(query).map((organization) =>
      organizationToSimple(organization),
    );
  }
}

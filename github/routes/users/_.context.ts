import type { Context$ } from "../../types/_.context.js";
import type { organization_full } from "../../types/components/schemas/organization-full.js";
import type { organization_invitation } from "../../types/components/schemas/organization-invitation.js";
import type { organization_simple } from "../../types/components/schemas/organization-simple.js";
import type { org_membership } from "../../types/components/schemas/org-membership.js";
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
  created_at: overrides.created_at ?? "2024-01-01T00:00:00Z",
  updated_at: overrides.updated_at ?? "2024-01-01T00:00:00Z",
  archived_at: overrides.archived_at ?? "",
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
  authenticatedLogin(): string;
  listRepositories(): Array<{ owner: { login: string }; private: boolean }>;
};

export class Context {
  private usersByLogin = new Map<string, public_user>();
  private orgsByLogin = new Map<string, organization_full>();
  private orgMembers = new Map<string, Map<string, org_membership>>();
  private orgInvitations = new Map<
    string,
    Map<number, organization_invitation>
  >();
  private outsideCollaborators = new Map<string, Set<string>>();
  private publicMembers = new Map<string, Set<string>>();
  private nextUserId = 100;
  private nextOrgId = 500;
  private nextInvitationId = 1;

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

  private membershipsFor(org: string) {
    const key = org.toLowerCase();
    let memberships = this.orgMembers.get(key);
    if (!memberships) {
      memberships = new Map();
      this.orgMembers.set(key, memberships);
    }
    return memberships;
  }

  setOrgMembership(
    org: string,
    username: string,
    role: "admin" | "member" | "billing_manager" = "member",
  ): org_membership {
    const organization = this.getOrganization(org);
    const user = this.getUser(username);
    if (!organization || !user) {
      throw new Error(`Unknown organization membership: ${org}/${username}`);
    }
    const membership: org_membership = {
      url: `${API_URL}/orgs/${org}/memberships/${username}`,
      state: "active",
      role,
      direct_membership: true,
      organization_url: `${API_URL}/orgs/${org}`,
      organization: organizationToSimple(organization),
      user: toSimpleUser(user),
      permissions: { can_create_repository: role === "admin" },
    };
    this.membershipsFor(org).set(username.toLowerCase(), membership);
    return { ...membership };
  }

  getOrgMembership(org: string, username: string): org_membership | undefined {
    const membership = this.orgMembers
      .get(org.toLowerCase())
      ?.get(username.toLowerCase());
    if (!membership) return undefined;
    const organization = this.getOrganization(org);
    const user = this.getUser(username);
    if (!organization || !user) return undefined;
    return {
      ...membership,
      organization: organizationToSimple(organization),
      organization_url: `${API_URL}/orgs/${organization.login}`,
      user: toSimpleUser(user),
    };
  }

  hasOrganizationMembership(org: string, username: string): boolean {
    return Boolean(this.getOrgMembership(org, username));
  }

  isOrgMember(org: string, username: string): boolean {
    return this.hasOrganizationMembership(org, username);
  }

  deleteOrgMembership(org: string, username: string): boolean {
    const deleted =
      this.orgMembers.get(org.toLowerCase())?.delete(username.toLowerCase()) ??
      false;
    this.publicMembers.get(org.toLowerCase())?.delete(username.toLowerCase());
    return deleted;
  }

  removeOrgMember(org: string, username: string): boolean {
    return this.deleteOrgMembership(org, username);
  }

  listOrgMembers(
    org: string,
    query?: { role?: unknown; page?: unknown; per_page?: unknown },
  ): simple_user[] {
    let memberships = [
      ...(this.orgMembers.get(org.toLowerCase())?.keys() ?? []),
    ]
      .map((username) => this.getOrgMembership(org, username))
      .filter((membership): membership is org_membership =>
        Boolean(membership),
      );
    if (query?.role === "admin" || query?.role === "member") {
      memberships = memberships.filter(
        ({ role }) => role === String(query.role),
      );
    }
    return paginate(
      memberships
        .map(({ user }) => user)
        .sort((left, right) => left.login.localeCompare(right.login)),
      query,
    );
  }

  private invitationsFor(org: string) {
    const key = org.toLowerCase();
    let invitations = this.orgInvitations.get(key);
    if (!invitations) {
      invitations = new Map();
      this.orgInvitations.set(key, invitations);
    }
    return invitations;
  }

  saveOrgInvitation(
    org: string,
    invitation: organization_invitation,
  ): organization_invitation {
    this.invitationsFor(org).set(invitation.id, { ...invitation });
    this.nextInvitationId = Math.max(this.nextInvitationId, invitation.id + 1);
    return { ...invitation };
  }

  createOrgInvitation(
    org: string,
    input: {
      invitee_id?: number;
      email?: string;
      role?: string;
      team_ids?: number[];
    },
  ): organization_invitation {
    const invitee =
      input.invitee_id == null
        ? undefined
        : this.listUsers().find(({ id }) => id === input.invitee_id);
    const inviter =
      this.getUser(this.rootContext().authenticatedLogin()) ??
      this.listUsers()[0];
    if (!inviter) throw new Error("An inviter user must be seeded first");
    const id = this.nextInvitationId++;
    const email = input.email ?? invitee?.email ?? "invitee@example.com";
    return this.saveOrgInvitation(org, {
      id,
      login: invitee?.login ?? email.split("@")[0]!,
      email,
      role: input.role ?? "direct_member",
      created_at: new Date().toISOString(),
      inviter: toSimpleUser(inviter),
      team_count: input.team_ids?.length ?? 0,
      node_id: `OI_${id}`,
      invitation_teams_url: `${API_URL}/orgs/${org}/invitations/${id}/teams`,
      invitation_source: "member",
    });
  }

  listOrgInvitations(
    org: string,
    query?: { role?: unknown; page?: unknown; per_page?: unknown },
  ): organization_invitation[] {
    let invitations = [
      ...(this.orgInvitations.get(org.toLowerCase())?.values() ?? []),
    ].filter(({ failed_at }) => !failed_at);
    if (query?.role && query.role !== "all") {
      invitations = invitations.filter(
        ({ role }) => role === String(query.role),
      );
    }
    return paginate(
      invitations.sort((left, right) => left.id - right.id),
      query,
    ).map((invitation) => {
      const inviter = this.getUser(invitation.inviter.login);
      return {
        ...invitation,
        inviter: inviter ? toSimpleUser(inviter) : invitation.inviter,
      };
    });
  }

  listFailedOrgInvitations(
    org: string,
    query?: { page?: unknown; per_page?: unknown },
  ): organization_invitation[] {
    return paginate(
      [...(this.orgInvitations.get(org.toLowerCase())?.values() ?? [])].filter(
        ({ failed_at }) => Boolean(failed_at),
      ),
      query,
    ).map((invitation) => ({ ...invitation }));
  }

  cancelOrgInvitation(org: string, invitationId: number): boolean {
    return (
      this.orgInvitations.get(org.toLowerCase())?.delete(invitationId) ?? false
    );
  }

  listOrgInvitationTeams(
    _org?: string,
    _invitationId?: number,
    _query?: { page?: unknown; per_page?: unknown },
  ) {
    return [];
  }

  private collaboratorsFor(org: string) {
    const key = org.toLowerCase();
    let collaborators = this.outsideCollaborators.get(key);
    if (!collaborators) {
      collaborators = new Set();
      this.outsideCollaborators.set(key, collaborators);
    }
    return collaborators;
  }

  addOutsideCollaborator(org: string, username: string): void {
    this.deleteOrgMembership(org, username);
    this.collaboratorsFor(org).add(username.toLowerCase());
  }

  removeOutsideCollaborator(org: string, username: string): boolean {
    return (
      this.outsideCollaborators
        .get(org.toLowerCase())
        ?.delete(username.toLowerCase()) ?? false
    );
  }

  listOutsideCollaborators(
    org: string,
    query?: { page?: unknown; per_page?: unknown },
  ): simple_user[] {
    const users = [...(this.outsideCollaborators.get(org.toLowerCase()) ?? [])]
      .map((login) => this.getUser(login))
      .filter((user): user is public_user => Boolean(user))
      .map(toSimpleUser);
    return paginate(users, query);
  }

  isPublicMember(org: string, username: string): boolean {
    return (
      this.publicMembers.get(org.toLowerCase())?.has(username.toLowerCase()) ??
      false
    );
  }

  publicizeMembership(org: string, username: string): void {
    if (!this.isOrgMember(org, username)) {
      throw new Error(`${username} is not a member of ${org}`);
    }
    const key = org.toLowerCase();
    let members = this.publicMembers.get(key);
    if (!members) {
      members = new Set();
      this.publicMembers.set(key, members);
    }
    members.add(username.toLowerCase());
  }

  concealMembership(org: string, username: string): void {
    this.publicMembers.get(org.toLowerCase())?.delete(username.toLowerCase());
  }

  listPublicMembers(
    org: string,
    query?: { page?: unknown; per_page?: unknown },
  ): simple_user[] {
    const users = [...(this.publicMembers.get(org.toLowerCase()) ?? [])]
      .map((login) => this.getUser(login))
      .filter((user): user is public_user => Boolean(user))
      .map(toSimpleUser);
    return paginate(users, query);
  }
}

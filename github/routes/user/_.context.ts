import type { Context$ } from "../../types/_.context.js";
import type { email } from "../../types/components/schemas/email.js";
import type { full_repository } from "../../types/components/schemas/full-repository.js";
import type { gpg_key } from "../../types/components/schemas/gpg-key.js";
import type { issue } from "../../types/components/schemas/issue.js";
import type { key } from "../../types/components/schemas/key.js";
import type { organization_simple } from "../../types/components/schemas/organization-simple.js";
import type { private_user } from "../../types/components/schemas/private-user.js";
import type { repository } from "../../types/components/schemas/repository.js";
import type { simple_user } from "../../types/components/schemas/simple-user.js";
import type { social_account } from "../../types/components/schemas/social-account.js";
import type { ssh_signing_key } from "../../types/components/schemas/ssh-signing-key.js";
import type { Context as RootContext } from "../_.context.js";
import { toSimpleUser } from "../users/_.context.js";

const API_URL = "https://api.github.com";
const APP_URL = "https://github.com";
const DEFAULT_PAGE_SIZE = 30;
const FIXTURE_TIME = "2024-01-01T00:00:00Z";

const asNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
};

const paginate = <T>(
  items: T[],
  query?: { page?: unknown; per_page?: unknown },
) => {
  const page = asNumber(query?.page, 1);
  const perPage = asNumber(query?.per_page, DEFAULT_PAGE_SIZE);
  return items.slice((page - 1) * perPage, page * perPage);
};

const defaultProfile = (): private_user => ({
  login: "octocat",
  id: 1,
  node_id: "U_1",
  avatar_url: `${APP_URL}/octocat.png`,
  gravatar_id: "",
  url: `${API_URL}/users/octocat`,
  html_url: `${APP_URL}/octocat`,
  followers_url: `${API_URL}/users/octocat/followers`,
  following_url: `${API_URL}/users/octocat/following{/other_user}`,
  gists_url: `${API_URL}/users/octocat/gists{/gist_id}`,
  starred_url: `${API_URL}/users/octocat/starred{/owner}{/repo}`,
  subscriptions_url: `${API_URL}/users/octocat/subscriptions`,
  organizations_url: `${API_URL}/users/octocat/orgs`,
  repos_url: `${API_URL}/users/octocat/repos`,
  events_url: `${API_URL}/users/octocat/events{/privacy}`,
  received_events_url: `${API_URL}/users/octocat/received_events`,
  type: "User",
  site_admin: false,
  user_view_type: "private",
  name: "The Octocat",
  company: "GitHub",
  blog: "https://github.blog",
  location: "San Francisco",
  email: "octocat@github.com",
  notification_email: "octocat@github.com",
  hireable: false,
  bio: "Mascot and sample user",
  public_repos: 1,
  public_gists: 8,
  followers: 0,
  following: 0,
  created_at: "2008-01-14T04:33:35Z",
  updated_at: FIXTURE_TIME,
  private_gists: 0,
  total_private_repos: 0,
  owned_private_repos: 0,
  disk_usage: 0,
  collaborators: 0,
  two_factor_authentication: true,
});

export class Context {
  private readonly loadContext: (path: string) => unknown;
  private profile = defaultProfile();
  private readonly emails = new Map<string, email>();
  private readonly sshKeys = new Map<number, key>();
  private readonly gpgKeys = new Map<number, gpg_key>();
  private readonly sshSigningKeys = new Map<number, ssh_signing_key>();
  private readonly following = new Set<string>();
  private readonly followers = new Set<string>();
  private readonly starredRepos = new Set<string>();
  private readonly subscribedRepos = new Set<string>();
  private readonly socialAccounts = new Map<string, social_account>();
  private nextSshKeyId = 1;
  private nextGpgKeyId = 1;
  private nextSshSigningKeyId = 1;

  constructor($: Context$) {
    this.loadContext = $.loadContext;
  }

  private root(): RootContext {
    return this.loadContext("/") as RootContext;
  }

  authenticatedLogin() {
    return this.profile.login;
  }

  getUser(...args: Parameters<RootContext["getUser"]>) {
    return this.root().getUser(...args);
  }

  getRepository(...args: Parameters<RootContext["getRepository"]>) {
    return this.root().getRepository(...args);
  }

  listAllIssues(...args: Parameters<RootContext["listAllIssues"]>) {
    return this.root().listAllIssues(...args);
  }

  setProfile(patch: Partial<private_user> & { login?: string }) {
    this.profile = { ...this.profile, ...patch };
    const canonical = this.root().getUser(this.profile.login);
    if (canonical) {
      this.root().saveUser({ ...patch, login: this.profile.login });
    }
    return this.getProfile();
  }

  getProfile(): private_user {
    const canonical = this.root().getUser(this.profile.login);
    return canonical
      ? ({ ...this.profile, ...canonical } as private_user)
      : { ...this.profile };
  }

  updateProfile(patch: Partial<private_user>): private_user {
    this.profile = {
      ...this.profile,
      ...patch,
      updated_at: new Date().toISOString(),
    };
    this.root().saveUser({ ...patch, login: this.profile.login });
    return this.getProfile();
  }

  saveEmail(value: email): email {
    const saved = { ...value };
    this.emails.set(saved.email.toLowerCase(), saved);
    return { ...saved };
  }

  listEmails(query?: { page?: unknown; per_page?: unknown }): email[] {
    return paginate(
      [...this.emails.values()]
        .map((value) => ({ ...value }))
        .sort((left, right) => Number(right.primary) - Number(left.primary)),
      query,
    );
  }

  addEmail(
    address: string,
    options: Partial<Pick<email, "primary" | "verified" | "visibility">> = {},
  ): email {
    return this.saveEmail({
      email: address,
      primary: options.primary ?? this.emails.size === 0,
      verified: options.verified ?? true,
      visibility: options.visibility ?? "private",
    });
  }

  deleteEmail(address: string): boolean {
    return this.emails.delete(address.toLowerCase());
  }

  listPublicEmails(query?: { page?: unknown; per_page?: unknown }): email[] {
    return paginate(
      [...this.emails.values()]
        .filter(({ visibility }) => visibility === "public")
        .map((value) => ({ ...value })),
      query,
    );
  }

  setEmailVisibility(visibility: string): email[] {
    for (const [address, value] of this.emails) {
      if (value.primary) {
        this.emails.set(address, { ...value, visibility });
      }
    }
    return this.listEmails();
  }

  saveSshKey(value: key): key {
    this.sshKeys.set(value.id, { ...value });
    this.nextSshKeyId = Math.max(this.nextSshKeyId, value.id + 1);
    return { ...value };
  }

  listSshKeys(query?: { page?: unknown; per_page?: unknown }): key[] {
    return paginate([...this.sshKeys.values()], query).map((value) => ({
      ...value,
    }));
  }

  addSshKey(input: { title?: string; key: string }): key {
    const id = this.nextSshKeyId++;
    return this.saveSshKey({
      title: input.title ?? "Untitled key",
      key: input.key,
      id,
      url: `${API_URL}/user/keys/${id}`,
      created_at: new Date().toISOString(),
      verified: true,
      read_only: false,
    });
  }

  getSshKey(id: number): key | undefined {
    const value = this.sshKeys.get(id);
    return value ? { ...value } : undefined;
  }

  deleteSshKey(id: number): boolean {
    return this.sshKeys.delete(id);
  }

  saveGpgKey(value: gpg_key): gpg_key {
    this.gpgKeys.set(value.id, { ...value });
    this.nextGpgKeyId = Math.max(this.nextGpgKeyId, value.id + 1);
    return { ...value };
  }

  listGpgKeys(query?: { page?: unknown; per_page?: unknown }): gpg_key[] {
    return paginate([...this.gpgKeys.values()], query).map((value) => ({
      ...value,
    }));
  }

  addGpgKey(input: { armored_public_key: string; name?: string }): gpg_key {
    const id = this.nextGpgKeyId++;
    return this.saveGpgKey({
      id,
      name: input.name,
      primary_key_id: id,
      key_id: id.toString(16).toUpperCase().padStart(16, "0"),
      public_key: input.armored_public_key,
      raw_key: input.armored_public_key,
      emails: [{ email: this.profile.email, verified: true }],
      subkeys: [],
      can_sign: true,
      can_encrypt_comms: true,
      can_encrypt_storage: true,
      can_certify: true,
      created_at: new Date().toISOString(),
      expires_at: "",
      revoked: false,
    });
  }

  getGpgKey(id: number): gpg_key | undefined {
    const value = this.gpgKeys.get(id);
    return value ? { ...value } : undefined;
  }

  deleteGpgKey(id: number): boolean {
    return this.gpgKeys.delete(id);
  }

  saveSshSigningKey(value: ssh_signing_key): ssh_signing_key {
    this.sshSigningKeys.set(value.id, { ...value });
    this.nextSshSigningKeyId = Math.max(this.nextSshSigningKeyId, value.id + 1);
    return { ...value };
  }

  listSshSigningKeys(query?: {
    page?: unknown;
    per_page?: unknown;
  }): ssh_signing_key[] {
    return paginate([...this.sshSigningKeys.values()], query).map((value) => ({
      ...value,
    }));
  }

  addSshSigningKey(input: { title?: string; key: string }): ssh_signing_key {
    const id = this.nextSshSigningKeyId++;
    return this.saveSshSigningKey({
      title: input.title ?? "Untitled signing key",
      key: input.key,
      id,
      created_at: new Date().toISOString(),
    });
  }

  getSshSigningKey(id: number): ssh_signing_key | undefined {
    const value = this.sshSigningKeys.get(id);
    return value ? { ...value } : undefined;
  }

  deleteSshSigningKey(id: number): boolean {
    return this.sshSigningKeys.delete(id);
  }

  follow(username: string): void {
    this.following.add(username.toLowerCase());
  }

  unfollow(username: string): void {
    this.following.delete(username.toLowerCase());
  }

  isFollowing(username: string): boolean {
    return this.following.has(username.toLowerCase());
  }

  saveFollower(username: string): void {
    this.followers.add(username.toLowerCase());
  }

  private simpleUsers(logins: Iterable<string>): simple_user[] {
    return [...logins]
      .map((login) => this.root().getUser(login))
      .filter((user): user is NonNullable<typeof user> => Boolean(user))
      .map(toSimpleUser)
      .sort((left, right) => left.login.localeCompare(right.login));
  }

  listFollowing(query?: { page?: unknown; per_page?: unknown }): simple_user[] {
    return paginate(this.simpleUsers(this.following), query);
  }

  listFollowers(query?: { page?: unknown; per_page?: unknown }): simple_user[] {
    return paginate(this.simpleUsers(this.followers), query);
  }

  starRepo(owner: string, repo: string): void {
    this.starredRepos.add(`${owner}/${repo}`.toLowerCase());
  }

  unstarRepo(owner: string, repo: string): void {
    this.starredRepos.delete(`${owner}/${repo}`.toLowerCase());
  }

  isStarred(owner: string, repo: string): boolean {
    return this.starredRepos.has(`${owner}/${repo}`.toLowerCase());
  }

  listStarredRepos(query?: {
    page?: unknown;
    per_page?: unknown;
  }): repository[] {
    const repositories = [...this.starredRepos]
      .map((key) =>
        this.root().getRepository(...(key.split("/") as [string, string])),
      )
      .filter((repository): repository is full_repository =>
        Boolean(repository),
      );
    return paginate(repositories, query).map(
      (item) => item as unknown as repository,
    );
  }

  subscribeRepo(owner: string, repo: string): void {
    this.subscribedRepos.add(`${owner}/${repo}`.toLowerCase());
  }

  listSubscriptions(query?: {
    page?: unknown;
    per_page?: unknown;
  }): full_repository[] {
    const repositories = [...this.subscribedRepos]
      .map((key) =>
        this.root().getRepository(...(key.split("/") as [string, string])),
      )
      .filter((repository): repository is full_repository =>
        Boolean(repository),
      );
    return paginate(repositories, query);
  }

  listOrgMemberships(query?: {
    page?: unknown;
    per_page?: unknown;
  }): organization_simple[] {
    const organizations = this.root()
      .listOrganizations()
      .filter((organization) =>
        this.root().hasOrganizationMembership?.(
          organization.login,
          this.profile.login,
        ),
      );
    return paginate(organizations, query);
  }

  listUserRepos(query?: {
    visibility?: string;
    affiliation?: string;
    type?: string;
    sort?: string;
    direction?: string;
    since?: string;
    before?: string;
    page?: unknown;
    per_page?: unknown;
  }): repository[] {
    return this.root()
      .listUserRepositories(query, this.profile.login)
      .map((item) => item as unknown as repository);
  }

  listAssignedIssues(query?: Record<string, unknown>): issue[] {
    return this.root().listAllIssues({ ...query, filter: "assigned" });
  }

  saveSocialAccount(value: social_account): social_account {
    this.socialAccounts.set(value.url, { ...value });
    return { ...value };
  }

  listSocialAccounts(query?: {
    page?: unknown;
    per_page?: unknown;
  }): social_account[] {
    return paginate([...this.socialAccounts.values()], query).map((value) => ({
      ...value,
    }));
  }

  addSocialAccounts(urls: string[]): social_account[] {
    return urls.map((url) => {
      const hostname = new URL(url).hostname.replace(/^www\./, "");
      return this.saveSocialAccount({ provider: hostname.split(".")[0]!, url });
    });
  }

  deleteSocialAccounts(urls: string[]): boolean {
    return urls.reduce(
      (deleted, url) => this.socialAccounts.delete(url) || deleted,
      false,
    );
  }

  saveAuthenticatedRepository(
    input: Record<string, unknown> & { name: string },
  ) {
    const repository = {
      ...input,
      owner: this.profile.login,
    } as unknown as Parameters<RootContext["saveRepository"]>[0];
    return this.root().saveRepository(repository);
  }
}

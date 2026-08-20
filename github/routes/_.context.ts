import type { Context$ } from "../types/_.context.js";
import type { gist_comment } from "../types/components/schemas/gist-comment.js";
import type { gist_simple } from "../types/components/schemas/gist-simple.js";
import type { organization_full } from "../types/components/schemas/organization-full.js";
import type { organization_simple } from "../types/components/schemas/organization-simple.js";
import type { public_user } from "../types/components/schemas/public-user.js";
import type { simple_user } from "../types/components/schemas/simple-user.js";
import type { Context as GistsContext } from "./gists/_.context.js";
import type { Context as CodesOfConductContext } from "./codes_of_conduct/_.context.js";
import type { Context as EmojisContext } from "./emojis/_.context.js";
import type { Context as GitignoreContext } from "./gitignore/_.context.js";
import type { Context as LicensesContext } from "./licenses/_.context.js";
import type { Context as MarkdownContext } from "./markdown/_.context.js";
import type { Context as MetaContext } from "./meta/_.context.js";
import type { Context as NotificationsContext } from "./notifications/_.context.js";
import type { Context as RateLimitContext } from "./rate_limit/_.context.js";
import type { Context as ReposContext } from "./repos/_.context.js";
import type { Context as AuthenticatedUserContext } from "./user/_.context.js";
import type { Context as UsersContext } from "./users/_.context.js";

export class Context {
  private readonly loadContext: (path: string) => unknown;

  constructor($: Context$) {
    this.loadContext = $.loadContext;
  }

  private gistsContext(): GistsContext {
    return this.loadContext("/gists") as GistsContext;
  }

  private emojisContext(): EmojisContext {
    return this.loadContext("/emojis") as EmojisContext;
  }

  private licensesContext(): LicensesContext {
    return this.loadContext("/licenses") as LicensesContext;
  }

  private rateLimitContext(): RateLimitContext {
    return this.loadContext("/rate_limit") as RateLimitContext;
  }

  private markdownContext(): MarkdownContext {
    return this.loadContext("/markdown") as MarkdownContext;
  }

  private codesOfConductContext(): CodesOfConductContext {
    return this.loadContext("/codes_of_conduct") as CodesOfConductContext;
  }

  private gitignoreContext(): GitignoreContext {
    return this.loadContext("/gitignore") as GitignoreContext;
  }

  private metaContext(): MetaContext {
    return this.loadContext("/meta") as MetaContext;
  }

  private notificationsContext(): NotificationsContext {
    return this.loadContext("/notifications") as NotificationsContext;
  }

  saveEmoji(...args: Parameters<EmojisContext["saveEmoji"]>) {
    return this.emojisContext().saveEmoji(...args);
  }

  listEmojis(...args: Parameters<EmojisContext["listEmojis"]>) {
    return this.emojisContext().listEmojis(...args);
  }

  saveLicense(...args: Parameters<LicensesContext["saveLicense"]>) {
    return this.licensesContext().saveLicense(...args);
  }

  getLicense(...args: Parameters<LicensesContext["getLicense"]>) {
    return this.licensesContext().getLicense(...args);
  }

  listLicenses(...args: Parameters<LicensesContext["listLicenses"]>) {
    return this.licensesContext().listLicenses(...args);
  }

  getRateLimitOverview(
    ...args: Parameters<RateLimitContext["getRateLimitOverview"]>
  ) {
    return this.rateLimitContext().getRateLimitOverview(...args);
  }

  getRateLimit(...args: Parameters<RateLimitContext["getRateLimit"]>) {
    return this.rateLimitContext().getRateLimit(...args);
  }

  setRateLimit(...args: Parameters<RateLimitContext["setRateLimit"]>) {
    return this.rateLimitContext().setRateLimit(...args);
  }

  consumeRequest(...args: Parameters<RateLimitContext["consumeRequest"]>) {
    return this.rateLimitContext().consumeRequest(...args);
  }

  resetRateLimit(...args: Parameters<RateLimitContext["resetRateLimit"]>) {
    return this.rateLimitContext().resetRateLimit(...args);
  }

  renderMarkdown(...args: Parameters<MarkdownContext["renderMarkdown"]>) {
    return this.markdownContext().renderMarkdown(...args);
  }

  renderRaw(...args: Parameters<MarkdownContext["renderRaw"]>) {
    return this.markdownContext().renderRaw(...args);
  }

  commonMarkerVersion(
    ...args: Parameters<MarkdownContext["commonMarkerVersion"]>
  ) {
    return this.markdownContext().commonMarkerVersion(...args);
  }

  saveCodeOfConduct(
    ...args: Parameters<CodesOfConductContext["saveCodeOfConduct"]>
  ) {
    return this.codesOfConductContext().saveCodeOfConduct(...args);
  }

  listCodesOfConduct(
    ...args: Parameters<CodesOfConductContext["listCodesOfConduct"]>
  ) {
    return this.codesOfConductContext().listCodesOfConduct(...args);
  }

  getCodeOfConduct(
    ...args: Parameters<CodesOfConductContext["getCodeOfConduct"]>
  ) {
    return this.codesOfConductContext().getCodeOfConduct(...args);
  }

  saveGitignoreTemplate(
    ...args: Parameters<GitignoreContext["saveGitignoreTemplate"]>
  ) {
    return this.gitignoreContext().saveGitignoreTemplate(...args);
  }

  listGitignoreTemplates(
    ...args: Parameters<GitignoreContext["listGitignoreTemplates"]>
  ) {
    return this.gitignoreContext().listGitignoreTemplates(...args);
  }

  getGitignoreTemplate(
    ...args: Parameters<GitignoreContext["getGitignoreTemplate"]>
  ) {
    return this.gitignoreContext().getGitignoreTemplate(...args);
  }

  setApiOverview(...args: Parameters<MetaContext["setApiOverview"]>) {
    return this.metaContext().setApiOverview(...args);
  }

  getApiOverview(...args: Parameters<MetaContext["getApiOverview"]>) {
    return this.metaContext().getApiOverview(...args);
  }

  saveNotification(
    ...args: Parameters<NotificationsContext["saveNotification"]>
  ) {
    return this.notificationsContext().saveNotification(...args);
  }

  getNotification(
    ...args: Parameters<NotificationsContext["getNotification"]>
  ) {
    return this.notificationsContext().getNotification(...args);
  }

  markNotificationRead(
    ...args: Parameters<NotificationsContext["markNotificationRead"]>
  ) {
    return this.notificationsContext().markNotificationRead(...args);
  }

  markNotificationDone(
    ...args: Parameters<NotificationsContext["markNotificationDone"]>
  ) {
    return this.notificationsContext().markNotificationDone(...args);
  }

  markAllNotificationsRead(
    ...args: Parameters<NotificationsContext["markAllNotificationsRead"]>
  ) {
    return this.notificationsContext().markAllNotificationsRead(...args);
  }

  listNotifications(
    ...args: Parameters<NotificationsContext["listNotifications"]>
  ) {
    return this.notificationsContext().listNotifications(...args);
  }

  getThreadSubscription(
    ...args: Parameters<NotificationsContext["getThreadSubscription"]>
  ) {
    return this.notificationsContext().getThreadSubscription(...args);
  }

  setThreadSubscription(
    ...args: Parameters<NotificationsContext["setThreadSubscription"]>
  ) {
    return this.notificationsContext().setThreadSubscription(...args);
  }

  deleteThreadSubscription(
    ...args: Parameters<NotificationsContext["deleteThreadSubscription"]>
  ) {
    return this.notificationsContext().deleteThreadSubscription(...args);
  }

  private usersContext(): UsersContext {
    return this.loadContext("/users") as UsersContext;
  }

  private authenticatedUserContext(): AuthenticatedUserContext {
    return this.loadContext("/user") as AuthenticatedUserContext;
  }

  private reposContext(): ReposContext {
    return this.loadContext("/repos") as ReposContext;
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

  searchUsers(...args: Parameters<UsersContext["searchUsers"]>) {
    return this.usersContext().searchUsers(...args);
  }

  saveRepository(...args: Parameters<ReposContext["saveRepository"]>) {
    return this.reposContext().saveRepository(...args);
  }

  getRepository(...args: Parameters<ReposContext["getRepository"]>) {
    return this.reposContext().getRepository(...args);
  }

  hasRepository(...args: Parameters<ReposContext["hasRepository"]>) {
    return this.reposContext().hasRepository(...args);
  }

  updateRepository(...args: Parameters<ReposContext["updateRepository"]>) {
    return this.reposContext().updateRepository(...args);
  }

  deleteRepository(...args: Parameters<ReposContext["deleteRepository"]>) {
    return this.reposContext().deleteRepository(...args);
  }

  addRepositoryCollaborator(
    ...args: Parameters<ReposContext["addRepositoryCollaborator"]>
  ) {
    return this.reposContext().addRepositoryCollaborator(...args);
  }

  listRepositories(...args: Parameters<ReposContext["listRepositories"]>) {
    return this.reposContext().listRepositories(...args);
  }

  listAllIssues(...args: Parameters<ReposContext["listAllIssues"]>) {
    return this.reposContext().listAllIssues(...args);
  }

  searchCommits(...args: Parameters<ReposContext["searchCommits"]>) {
    return this.reposContext().searchCommits(...args);
  }

  searchLabels(...args: Parameters<ReposContext["searchLabels"]>) {
    return this.reposContext().searchLabels(...args);
  }

  searchTopics(...args: Parameters<ReposContext["searchTopics"]>) {
    return this.reposContext().searchTopics(...args);
  }

  searchCode(...args: Parameters<ReposContext["searchCode"]>) {
    return this.reposContext().searchCode(...args);
  }

  listUserRepositories(
    ...args: Parameters<ReposContext["listUserRepositories"]>
  ) {
    return this.reposContext().listUserRepositories(...args);
  }

  listRepositoriesForOwner(
    ...args: Parameters<ReposContext["listRepositoriesForOwner"]>
  ) {
    return this.reposContext().listRepositoriesForOwner(...args);
  }

  getRepositoryReadme(
    ...args: Parameters<ReposContext["getRepositoryReadme"]>
  ) {
    return this.reposContext().getRepositoryReadme(...args);
  }

  getRepositoryBranch(
    ...args: Parameters<ReposContext["getRepositoryBranch"]>
  ) {
    return this.reposContext().getRepositoryBranch(...args);
  }

  getCommit(...args: Parameters<ReposContext["getCommit"]>) {
    return this.reposContext().getCommit(...args);
  }

  listCommits(...args: Parameters<ReposContext["listCommits"]>) {
    return this.reposContext().listCommits(...args);
  }

  saveCommitStatus(...args: Parameters<ReposContext["saveCommitStatus"]>) {
    return this.reposContext().saveCommitStatus(...args);
  }

  listCommitStatuses(...args: Parameters<ReposContext["listCommitStatuses"]>) {
    return this.reposContext().listCommitStatuses(...args);
  }

  getCombinedStatus(...args: Parameters<ReposContext["getCombinedStatus"]>) {
    return this.reposContext().getCombinedStatus(...args);
  }

  saveCommitComment(...args: Parameters<ReposContext["saveCommitComment"]>) {
    return this.reposContext().saveCommitComment(...args);
  }

  listCommitComments(...args: Parameters<ReposContext["listCommitComments"]>) {
    return this.reposContext().listCommitComments(...args);
  }

  saveLabel(...args: Parameters<ReposContext["saveLabel"]>) {
    return this.reposContext().saveLabel(...args);
  }

  getLabel(...args: Parameters<ReposContext["getLabel"]>) {
    return this.reposContext().getLabel(...args);
  }

  updateLabel(...args: Parameters<ReposContext["updateLabel"]>) {
    return this.reposContext().updateLabel(...args);
  }

  deleteLabel(...args: Parameters<ReposContext["deleteLabel"]>) {
    return this.reposContext().deleteLabel(...args);
  }

  listLabels(...args: Parameters<ReposContext["listLabels"]>) {
    return this.reposContext().listLabels(...args);
  }

  saveMilestone(...args: Parameters<ReposContext["saveMilestone"]>) {
    return this.reposContext().saveMilestone(...args);
  }

  getMilestone(...args: Parameters<ReposContext["getMilestone"]>) {
    return this.reposContext().getMilestone(...args);
  }

  updateMilestone(...args: Parameters<ReposContext["updateMilestone"]>) {
    return this.reposContext().updateMilestone(...args);
  }

  deleteMilestone(...args: Parameters<ReposContext["deleteMilestone"]>) {
    return this.reposContext().deleteMilestone(...args);
  }

  listMilestones(...args: Parameters<ReposContext["listMilestones"]>) {
    return this.reposContext().listMilestones(...args);
  }

  saveIssue(...args: Parameters<ReposContext["saveIssue"]>) {
    return this.reposContext().saveIssue(...args);
  }

  getIssue(...args: Parameters<ReposContext["getIssue"]>) {
    return this.reposContext().getIssue(...args);
  }

  listIssues(...args: Parameters<ReposContext["listIssues"]>) {
    return this.reposContext().listIssues(...args);
  }

  saveIssueComment(...args: Parameters<ReposContext["saveIssueComment"]>) {
    return this.reposContext().saveIssueComment(...args);
  }

  listIssueComments(...args: Parameters<ReposContext["listIssueComments"]>) {
    return this.reposContext().listIssueComments(...args);
  }

  addLabelToIssue(...args: Parameters<ReposContext["addLabelToIssue"]>) {
    return this.reposContext().addLabelToIssue(...args);
  }

  removeLabelFromIssue(
    ...args: Parameters<ReposContext["removeLabelFromIssue"]>
  ) {
    return this.reposContext().removeLabelFromIssue(...args);
  }

  replaceIssueLabels(...args: Parameters<ReposContext["replaceIssueLabels"]>) {
    return this.reposContext().replaceIssueLabels(...args);
  }

  listIssueLabels(...args: Parameters<ReposContext["listIssueLabels"]>) {
    return this.reposContext().listIssueLabels(...args);
  }

  savePullRequest(...args: Parameters<ReposContext["savePullRequest"]>) {
    return this.reposContext().savePullRequest(...args);
  }

  getPullRequest(...args: Parameters<ReposContext["getPullRequest"]>) {
    return this.reposContext().getPullRequest(...args);
  }

  listPullRequests(...args: Parameters<ReposContext["listPullRequests"]>) {
    return this.reposContext().listPullRequests(...args);
  }

  savePullRequestReview(
    ...args: Parameters<ReposContext["savePullRequestReview"]>
  ) {
    return this.reposContext().savePullRequestReview(...args);
  }

  listPullRequestReviews(
    ...args: Parameters<ReposContext["listPullRequestReviews"]>
  ) {
    return this.reposContext().listPullRequestReviews(...args);
  }

  saveWorkflow(...args: Parameters<ReposContext["saveWorkflow"]>) {
    return this.reposContext().saveWorkflow(...args);
  }

  listWorkflows(...args: Parameters<ReposContext["listWorkflows"]>) {
    return this.reposContext().listWorkflows(...args);
  }

  saveWorkflowRun(...args: Parameters<ReposContext["saveWorkflowRun"]>) {
    return this.reposContext().saveWorkflowRun(...args);
  }

  listWorkflowRuns(...args: Parameters<ReposContext["listWorkflowRuns"]>) {
    return this.reposContext().listWorkflowRuns(...args);
  }

  saveWorkflowJob(...args: Parameters<ReposContext["saveWorkflowJob"]>) {
    return this.reposContext().saveWorkflowJob(...args);
  }

  listWorkflowJobs(...args: Parameters<ReposContext["listWorkflowJobs"]>) {
    return this.reposContext().listWorkflowJobs(...args);
  }

  searchRepositories(...args: Parameters<ReposContext["searchRepositories"]>) {
    return this.reposContext().searchRepositories(...args);
  }

  searchIssuesAndPullRequests(
    ...args: Parameters<ReposContext["searchIssuesAndPullRequests"]>
  ) {
    return this.reposContext().searchIssuesAndPullRequests(...args);
  }

  saveRelease(...args: Parameters<ReposContext["saveRelease"]>) {
    return this.reposContext().saveRelease(...args);
  }

  getRelease(...args: Parameters<ReposContext["getRelease"]>) {
    return this.reposContext().getRelease(...args);
  }

  getReleaseByTag(...args: Parameters<ReposContext["getReleaseByTag"]>) {
    return this.reposContext().getReleaseByTag(...args);
  }

  getLatestRelease(...args: Parameters<ReposContext["getLatestRelease"]>) {
    return this.reposContext().getLatestRelease(...args);
  }

  updateRelease(...args: Parameters<ReposContext["updateRelease"]>) {
    return this.reposContext().updateRelease(...args);
  }

  deleteRelease(...args: Parameters<ReposContext["deleteRelease"]>) {
    return this.reposContext().deleteRelease(...args);
  }

  listReleases(...args: Parameters<ReposContext["listReleases"]>) {
    return this.reposContext().listReleases(...args);
  }

  setOrgMembership(...args: Parameters<UsersContext["setOrgMembership"]>) {
    return this.usersContext().setOrgMembership(...args);
  }

  getOrgMembership(...args: Parameters<UsersContext["getOrgMembership"]>) {
    return this.usersContext().getOrgMembership(...args);
  }

  hasOrganizationMembership(
    ...args: Parameters<UsersContext["hasOrganizationMembership"]>
  ) {
    return this.usersContext().hasOrganizationMembership(...args);
  }

  isOrgMember(...args: Parameters<UsersContext["isOrgMember"]>) {
    return this.usersContext().isOrgMember(...args);
  }

  deleteOrgMembership(
    ...args: Parameters<UsersContext["deleteOrgMembership"]>
  ) {
    return this.usersContext().deleteOrgMembership(...args);
  }

  removeOrgMember(...args: Parameters<UsersContext["removeOrgMember"]>) {
    return this.usersContext().removeOrgMember(...args);
  }

  listOrgMembers(...args: Parameters<UsersContext["listOrgMembers"]>) {
    return this.usersContext().listOrgMembers(...args);
  }

  saveOrgInvitation(...args: Parameters<UsersContext["saveOrgInvitation"]>) {
    return this.usersContext().saveOrgInvitation(...args);
  }

  createOrgInvitation(
    ...args: Parameters<UsersContext["createOrgInvitation"]>
  ) {
    return this.usersContext().createOrgInvitation(...args);
  }

  listOrgInvitations(...args: Parameters<UsersContext["listOrgInvitations"]>) {
    return this.usersContext().listOrgInvitations(...args);
  }

  listFailedOrgInvitations(
    ...args: Parameters<UsersContext["listFailedOrgInvitations"]>
  ) {
    return this.usersContext().listFailedOrgInvitations(...args);
  }

  cancelOrgInvitation(
    ...args: Parameters<UsersContext["cancelOrgInvitation"]>
  ) {
    return this.usersContext().cancelOrgInvitation(...args);
  }

  listOrgInvitationTeams(
    ...args: Parameters<UsersContext["listOrgInvitationTeams"]>
  ) {
    return this.usersContext().listOrgInvitationTeams(...args);
  }

  addOutsideCollaborator(
    ...args: Parameters<UsersContext["addOutsideCollaborator"]>
  ) {
    return this.usersContext().addOutsideCollaborator(...args);
  }

  removeOutsideCollaborator(
    ...args: Parameters<UsersContext["removeOutsideCollaborator"]>
  ) {
    return this.usersContext().removeOutsideCollaborator(...args);
  }

  listOutsideCollaborators(
    ...args: Parameters<UsersContext["listOutsideCollaborators"]>
  ) {
    return this.usersContext().listOutsideCollaborators(...args);
  }

  isPublicMember(...args: Parameters<UsersContext["isPublicMember"]>) {
    return this.usersContext().isPublicMember(...args);
  }

  publicizeMembership(
    ...args: Parameters<UsersContext["publicizeMembership"]>
  ) {
    return this.usersContext().publicizeMembership(...args);
  }

  concealMembership(...args: Parameters<UsersContext["concealMembership"]>) {
    return this.usersContext().concealMembership(...args);
  }

  listPublicMembers(...args: Parameters<UsersContext["listPublicMembers"]>) {
    return this.usersContext().listPublicMembers(...args);
  }

  setProfile(...args: Parameters<AuthenticatedUserContext["setProfile"]>) {
    return this.authenticatedUserContext().setProfile(...args);
  }

  authenticatedLogin(
    ...args: Parameters<AuthenticatedUserContext["authenticatedLogin"]>
  ) {
    return this.authenticatedUserContext().authenticatedLogin(...args);
  }

  getProfile(...args: Parameters<AuthenticatedUserContext["getProfile"]>) {
    return this.authenticatedUserContext().getProfile(...args);
  }

  updateProfile(
    ...args: Parameters<AuthenticatedUserContext["updateProfile"]>
  ) {
    return this.authenticatedUserContext().updateProfile(...args);
  }

  saveEmail(...args: Parameters<AuthenticatedUserContext["saveEmail"]>) {
    return this.authenticatedUserContext().saveEmail(...args);
  }

  listEmails(...args: Parameters<AuthenticatedUserContext["listEmails"]>) {
    return this.authenticatedUserContext().listEmails(...args);
  }

  addEmail(...args: Parameters<AuthenticatedUserContext["addEmail"]>) {
    return this.authenticatedUserContext().addEmail(...args);
  }

  deleteEmail(...args: Parameters<AuthenticatedUserContext["deleteEmail"]>) {
    return this.authenticatedUserContext().deleteEmail(...args);
  }

  listPublicEmails(
    ...args: Parameters<AuthenticatedUserContext["listPublicEmails"]>
  ) {
    return this.authenticatedUserContext().listPublicEmails(...args);
  }

  setEmailVisibility(
    ...args: Parameters<AuthenticatedUserContext["setEmailVisibility"]>
  ) {
    return this.authenticatedUserContext().setEmailVisibility(...args);
  }

  saveSshKey(...args: Parameters<AuthenticatedUserContext["saveSshKey"]>) {
    return this.authenticatedUserContext().saveSshKey(...args);
  }

  listSshKeys(...args: Parameters<AuthenticatedUserContext["listSshKeys"]>) {
    return this.authenticatedUserContext().listSshKeys(...args);
  }

  addSshKey(...args: Parameters<AuthenticatedUserContext["addSshKey"]>) {
    return this.authenticatedUserContext().addSshKey(...args);
  }

  getSshKey(...args: Parameters<AuthenticatedUserContext["getSshKey"]>) {
    return this.authenticatedUserContext().getSshKey(...args);
  }

  deleteSshKey(...args: Parameters<AuthenticatedUserContext["deleteSshKey"]>) {
    return this.authenticatedUserContext().deleteSshKey(...args);
  }

  saveGpgKey(...args: Parameters<AuthenticatedUserContext["saveGpgKey"]>) {
    return this.authenticatedUserContext().saveGpgKey(...args);
  }

  listGpgKeys(...args: Parameters<AuthenticatedUserContext["listGpgKeys"]>) {
    return this.authenticatedUserContext().listGpgKeys(...args);
  }

  addGpgKey(...args: Parameters<AuthenticatedUserContext["addGpgKey"]>) {
    return this.authenticatedUserContext().addGpgKey(...args);
  }

  getGpgKey(...args: Parameters<AuthenticatedUserContext["getGpgKey"]>) {
    return this.authenticatedUserContext().getGpgKey(...args);
  }

  deleteGpgKey(...args: Parameters<AuthenticatedUserContext["deleteGpgKey"]>) {
    return this.authenticatedUserContext().deleteGpgKey(...args);
  }

  saveSshSigningKey(
    ...args: Parameters<AuthenticatedUserContext["saveSshSigningKey"]>
  ) {
    return this.authenticatedUserContext().saveSshSigningKey(...args);
  }

  listSshSigningKeys(
    ...args: Parameters<AuthenticatedUserContext["listSshSigningKeys"]>
  ) {
    return this.authenticatedUserContext().listSshSigningKeys(...args);
  }

  addSshSigningKey(
    ...args: Parameters<AuthenticatedUserContext["addSshSigningKey"]>
  ) {
    return this.authenticatedUserContext().addSshSigningKey(...args);
  }

  getSshSigningKey(
    ...args: Parameters<AuthenticatedUserContext["getSshSigningKey"]>
  ) {
    return this.authenticatedUserContext().getSshSigningKey(...args);
  }

  deleteSshSigningKey(
    ...args: Parameters<AuthenticatedUserContext["deleteSshSigningKey"]>
  ) {
    return this.authenticatedUserContext().deleteSshSigningKey(...args);
  }

  follow(...args: Parameters<AuthenticatedUserContext["follow"]>) {
    return this.authenticatedUserContext().follow(...args);
  }

  unfollow(...args: Parameters<AuthenticatedUserContext["unfollow"]>) {
    return this.authenticatedUserContext().unfollow(...args);
  }

  isFollowing(...args: Parameters<AuthenticatedUserContext["isFollowing"]>) {
    return this.authenticatedUserContext().isFollowing(...args);
  }

  saveFollower(...args: Parameters<AuthenticatedUserContext["saveFollower"]>) {
    return this.authenticatedUserContext().saveFollower(...args);
  }

  listFollowing(
    ...args: Parameters<AuthenticatedUserContext["listFollowing"]>
  ) {
    return this.authenticatedUserContext().listFollowing(...args);
  }

  listFollowers(
    ...args: Parameters<AuthenticatedUserContext["listFollowers"]>
  ) {
    return this.authenticatedUserContext().listFollowers(...args);
  }

  starRepo(...args: Parameters<AuthenticatedUserContext["starRepo"]>) {
    return this.authenticatedUserContext().starRepo(...args);
  }

  unstarRepo(...args: Parameters<AuthenticatedUserContext["unstarRepo"]>) {
    return this.authenticatedUserContext().unstarRepo(...args);
  }

  isStarred(...args: Parameters<AuthenticatedUserContext["isStarred"]>) {
    return this.authenticatedUserContext().isStarred(...args);
  }

  listStarredRepos(
    ...args: Parameters<AuthenticatedUserContext["listStarredRepos"]>
  ) {
    return this.authenticatedUserContext().listStarredRepos(...args);
  }

  subscribeRepo(
    ...args: Parameters<AuthenticatedUserContext["subscribeRepo"]>
  ) {
    return this.authenticatedUserContext().subscribeRepo(...args);
  }

  listSubscriptions(
    ...args: Parameters<AuthenticatedUserContext["listSubscriptions"]>
  ) {
    return this.authenticatedUserContext().listSubscriptions(...args);
  }

  listOrgMemberships(
    ...args: Parameters<AuthenticatedUserContext["listOrgMemberships"]>
  ) {
    return this.authenticatedUserContext().listOrgMemberships(...args);
  }

  listUserRepos(
    ...args: Parameters<AuthenticatedUserContext["listUserRepos"]>
  ) {
    return this.authenticatedUserContext().listUserRepos(...args);
  }

  listAssignedIssues(
    ...args: Parameters<AuthenticatedUserContext["listAssignedIssues"]>
  ) {
    return this.authenticatedUserContext().listAssignedIssues(...args);
  }

  saveSocialAccount(
    ...args: Parameters<AuthenticatedUserContext["saveSocialAccount"]>
  ) {
    return this.authenticatedUserContext().saveSocialAccount(...args);
  }

  listSocialAccounts(
    ...args: Parameters<AuthenticatedUserContext["listSocialAccounts"]>
  ) {
    return this.authenticatedUserContext().listSocialAccounts(...args);
  }

  addSocialAccounts(
    ...args: Parameters<AuthenticatedUserContext["addSocialAccounts"]>
  ) {
    return this.authenticatedUserContext().addSocialAccounts(...args);
  }

  deleteSocialAccounts(
    ...args: Parameters<AuthenticatedUserContext["deleteSocialAccounts"]>
  ) {
    return this.authenticatedUserContext().deleteSocialAccounts(...args);
  }

  saveAuthenticatedRepository(
    ...args: Parameters<AuthenticatedUserContext["saveAuthenticatedRepository"]>
  ) {
    return this.authenticatedUserContext().saveAuthenticatedRepository(...args);
  }
}

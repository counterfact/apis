import assert from "node:assert/strict";
import test from "node:test";
import {
  authenticatedUser,
  identities,
  notifications,
  organizationMembers,
  repositories,
  seedGitHub,
} from "../scenarios/index.ts";
import { createContext } from "../test-support/create-context.ts";
import type { Scenario$ } from "../types/_.context.ts";

const seededContext = () => {
  const context = createContext();
  const $ = {
    context,
    loadContext: () => context,
    route: () => ({}),
    routes: {},
  } as unknown as Scenario$;
  seedGitHub($);
  return context;
};

test("organization memberships, invitations, and visibility share user state", () => {
  const context = seededContext();
  assert.deepEqual(
    context.listOrgMembers("counterfact").map(({ login }) => login),
    ["mona", "octocat"],
  );
  assert.equal(context.isPublicMember("counterfact", "mona"), true);
  assert.equal(context.listOrgInvitations("counterfact")[0]?.id, 201);
  context.saveUser({ login: "mona", name: "Updated Mona" });
  assert.equal(
    context.getOrgMembership("counterfact", "mona")?.user.name,
    "Updated Mona",
  );
  context.updateRepository("counterfact", "platform-api", {
    description: "Updated repository description",
  });
  assert.equal(
    context.getNotification("101")?.repository.description,
    "Updated repository description",
  );

  const invitation = context.createOrgInvitation("counterfact", {
    email: "new@example.com",
  });
  assert.ok(invitation.id > 201);
  assert.equal(context.cancelOrgInvitation("counterfact", invitation.id), true);

  context.setOrgMembership("counterfact", "hubot", "member");
  context.addOutsideCollaborator("counterfact", "hubot");
  assert.equal(context.isOrgMember("counterfact", "hubot"), false);
  assert.deepEqual(
    context.listOutsideCollaborators("counterfact").map(({ login }) => login),
    ["hubot"],
  );
  context.setOrgMembership("counterfact", "hubot", "member");
  assert.equal(context.isOrgMember("counterfact", "hubot"), true);
  assert.deepEqual(context.listOutsideCollaborators("counterfact"), []);

  const existingInvitation = context.listOrgInvitations("counterfact")[0];
  assert.ok(existingInvitation);
  context.saveOrgInvitation("counterfact", {
    ...existingInvitation,
    id: 202,
    login: "scim-bot",
    email: "scim-bot@example.com",
    invitation_source: "scim",
  });
  assert.deepEqual(
    context
      .listOrgInvitations("counterfact", {
        invitation_source: "scim",
        page: 1,
        per_page: 1,
      })
      .map(({ id }) => id),
    [202],
  );
});

test("authenticated-user mutations reuse identity and repository state", () => {
  const context = seededContext();
  assert.equal(context.getProfile().login, "octocat");
  assert.equal(context.listEmails().length, 2);
  assert.equal(context.isFollowing("mona"), true);
  assert.equal(context.isStarred("counterfact", "platform-api"), true);
  assert.equal(context.listOrgMemberships()[0]?.login, "counterfact");
  assert.equal(context.listUserRepos().length, 3);
  assert.ok(
    context
      .listUserRepos()
      .some(({ full_name }) => full_name === "octocat/hello-world"),
  );
  context.saveRepository({ owner: "mona", name: "private-to-mona" });
  assert.equal(
    context
      .listUserRepos()
      .some(({ full_name }) => full_name === "mona/private-to-mona"),
    false,
  );

  const key = context.addSshKey({ title: "Replacement", key: "ssh-ed25519 X" });
  assert.ok(key.id > 301);
  assert.equal(context.deleteSshKey(key.id), true);

  context.unfollow("mona");
  context.unstarRepo("counterfact", "platform-api");
  assert.equal(context.isFollowing("mona"), false);
  assert.equal(context.isStarred("counterfact", "platform-api"), false);

  context.updateProfile({ bio: "Canonical biography" });
  assert.equal(context.getUser("octocat")?.bio, "Canonical biography");
  context.setEmailVisibility("public");
  assert.equal(
    context.listEmails().find(({ email }) => email.includes("noreply"))
      ?.visibility,
    "private",
  );

  context.setProfile({ login: "mona" });
  const invitation = context.createOrgInvitation("counterfact", {
    email: "invited@example.com",
  });
  assert.equal(invitation.inviter.login, "mona");
});

test("domain scenarios preserve unrelated records that use fixture IDs", () => {
  const context = createContext();
  const $ = {
    context,
    loadContext: () => context,
    route: () => ({}),
    routes: {},
  } as unknown as Scenario$;
  identities($);
  repositories($);
  const repository = context.getRepository("counterfact", "platform-api")!;
  context.saveNotification({
    id: "101",
    repository,
    subject: {
      title: "Unrelated",
      type: "Issue",
      url: "https://api.github.com/repos/counterfact/platform-api/issues/999",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/999",
    },
  });
  context.saveOrgInvitation("counterfact", {
    id: 201,
    login: "someone-else",
    email: "someone@example.com",
    role: "direct_member",
    created_at: "2024-01-01T00:00:00Z",
    inviter: context.listSimpleUsers()[0]!,
    team_count: 0,
    node_id: "OI_unrelated",
    invitation_teams_url:
      "https://api.github.com/orgs/counterfact/invitations/201/teams",
  });
  context.saveSshKey({
    id: 301,
    title: "Unrelated key",
    key: "ssh-ed25519 UNRELATED",
    url: "https://api.github.com/user/keys/301",
    created_at: "2024-01-01T00:00:00Z",
    verified: true,
    read_only: false,
  });

  notifications($);
  organizationMembers($);
  authenticatedUser($);

  assert.equal(context.getNotification("101")?.subject.title, "Unrelated");
  assert.equal(context.getSshKey(301)?.title, "Unrelated key");
  assert.equal(
    context.listOrgInvitations("counterfact").find(({ id }) => id === 201)
      ?.login,
    "someone-else",
  );
  assert.ok(
    context
      .listOrgInvitations("counterfact")
      .some(({ login, id }) => login === "hubot" && id !== 201),
  );
});

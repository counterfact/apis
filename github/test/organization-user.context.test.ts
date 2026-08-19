import assert from "node:assert/strict";
import test from "node:test";
import { seedGitHub } from "../scenarios/index.ts";
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

  const key = context.addSshKey({ title: "Replacement", key: "ssh-ed25519 X" });
  assert.ok(key.id > 301);
  assert.equal(context.deleteSshKey(key.id), true);

  context.unfollow("mona");
  context.unstarRepo("counterfact", "platform-api");
  assert.equal(context.isFollowing("mona"), false);
  assert.equal(context.isStarred("counterfact", "platform-api"), false);
});

import assert from "node:assert/strict";
import test from "node:test";
import { startCounterfactServer } from "../test-support/counterfact-server.ts";

const json = (body: unknown, method = "POST") => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

test("organization and authenticated-user workflows are stateful over HTTP", async () => {
  const server = await startCounterfactServer();
  try {
    const members = await server.fetch("/orgs/counterfact/members");
    assert.equal(members.status, 200);
    assert.deepEqual(
      ((await members.json()) as Array<{ login: string }>).map(
        ({ login }) => login,
      ),
      ["mona", "octocat"],
    );
    assert.equal(
      (await server.fetch("/orgs/counterfact/members/octocat")).status,
      204,
    );

    const membership = await server.fetch(
      "/orgs/counterfact/memberships/hubot",
      json({ role: "member" }, "PUT"),
    );
    assert.equal(membership.status, 200);
    assert.equal(
      ((await membership.json()) as { role: string }).role,
      "member",
    );

    const invitation = await server.fetch(
      "/orgs/counterfact/invitations",
      json({ email: "new@example.com" }),
    );
    assert.equal(invitation.status, 201);
    assert.ok(((await invitation.json()) as { id: number }).id > 201);

    const profile = await server.fetch("/user");
    assert.equal(profile.status, 200);
    assert.equal(
      ((await profile.json()) as { login: string }).login,
      "octocat",
    );

    const repositories = await server.fetch(
      "/user/repos?sort=full_name&direction=asc",
    );
    assert.equal(repositories.status, 200);
    assert.deepEqual(
      ((await repositories.json()) as Array<{ full_name: string }>).map(
        ({ full_name }) => full_name,
      ),
      [
        "counterfact/actions-demo",
        "counterfact/platform-api",
        "octocat/hello-world",
      ],
    );
    const invalidRepositories = await server.fetch(
      "/user/repos?type=owner&visibility=public",
    );
    assert.equal(invalidRepositories.status, 422);
    assert.equal(
      ((await invalidRepositories.json()) as { message: string }).message,
      "Validation Failed",
    );

    const updated = await server.fetch(
      "/user",
      json({ bio: "Updated through HTTP" }, "PATCH"),
    );
    assert.equal(updated.status, 200);
    assert.equal(
      ((await updated.json()) as { bio: string }).bio,
      "Updated through HTTP",
    );

    assert.equal((await server.fetch("/user/following/mona")).status, 204);
    assert.equal(
      (await server.fetch("/user/following/mona", { method: "DELETE" })).status,
      204,
    );
    assert.equal((await server.fetch("/user/following/mona")).status, 404);

    const addedKey = await server.fetch(
      "/user/keys",
      json({ title: "CI", key: "ssh-ed25519 TEST" }),
    );
    assert.equal(addedKey.status, 201);
    const keyId = ((await addedKey.json()) as { id: number }).id;
    assert.ok(keyId > 301);
    assert.equal(
      (await server.fetch(`/user/keys/${keyId}`, { method: "DELETE" })).status,
      204,
    );
  } finally {
    await server.stop();
  }
});

test("authenticated-user relationship and repository mutations validate resources", async () => {
  const server = await startCounterfactServer();
  try {
    const assertNotFound = async (response: Response) => {
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), {
        message: "Not Found",
        status: "404",
      });
    };

    for (const method of ["GET", "PUT", "DELETE"] as const) {
      await assertNotFound(
        await server.fetch("/user/following/missing-user", { method }),
      );
    }
    assert.equal(server.context.isFollowing("missing-user"), false);

    assert.equal(
      (await server.fetch("/user/following/mona", { method: "DELETE" })).status,
      204,
    );
    assert.equal((await server.fetch("/user/following/mona")).status, 404);
    assert.equal(
      (await server.fetch("/user/following/mona", { method: "PUT" })).status,
      204,
    );
    assert.equal((await server.fetch("/user/following/mona")).status, 204);

    await assertNotFound(
      await server.fetch("/user/starred/missing-user/missing-repository", {
        method: "PUT",
      }),
    );
    await assertNotFound(
      await server.fetch("/user/starred/missing-user/missing-repository", {
        method: "DELETE",
      }),
    );
    assert.equal(
      server.context.isStarred("missing-user", "missing-repository"),
      false,
    );

    await assertNotFound(
      await server.fetch("/user/starred/octocat/hello-world", {
        method: "DELETE",
      }),
    );
    assert.equal(
      (
        await server.fetch("/user/starred/octocat/hello-world", {
          method: "PUT",
        })
      ).status,
      204,
    );
    assert.equal(
      (await server.fetch("/user/starred/octocat/hello-world")).status,
      204,
    );
    assert.equal(
      (
        await server.fetch("/user/starred/octocat/hello-world", {
          method: "DELETE",
        })
      ).status,
      204,
    );
    assert.equal(
      (await server.fetch("/user/starred/octocat/hello-world")).status,
      404,
    );

    const created = await server.fetch(
      "/user/repos",
      json({
        name: "route-duplicate",
        description: "The original repository",
        private: false,
      }),
    );
    assert.equal(created.status, 201);
    const duplicate = await server.fetch(
      "/user/repos",
      json({
        name: "route-duplicate",
        description: "A mutated duplicate",
        private: true,
      }),
    );
    assert.equal(duplicate.status, 422);
    assert.deepEqual(await duplicate.json(), {
      message: "Validation Failed",
      documentation_url:
        "https://docs.github.com/rest/repos/repos#create-a-repository-for-the-authenticated-user",
      errors: [
        {
          resource: "Repository",
          field: "name",
          code: "custom",
          message: "name already exists on this account",
        },
      ],
    });
    const preserved = server.context.getRepository(
      "octocat",
      "route-duplicate",
    );
    assert.ok(preserved);
    assert.equal(preserved.description, "The original repository");
    assert.equal(preserved.private, false);
  } finally {
    await server.stop();
  }
});

test("organization endpoints enforce resource and authenticated-user boundaries", async () => {
  const server = await startCounterfactServer();
  try {
    const assertNotFound = async (response: Response) => {
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), {
        message: "Not Found",
        status: "404",
      });
    };

    await assertNotFound(await server.fetch("/orgs/missing/invitations"));
    await assertNotFound(
      await server.fetch(
        "/orgs/missing/invitations",
        json({ email: "new@example.com" }),
      ),
    );
    await assertNotFound(
      await server.fetch("/orgs/missing/failed_invitations"),
    );

    const existingInvitation =
      server.context.listOrgInvitations("counterfact")[0];
    assert.ok(existingInvitation);
    server.context.saveOrgInvitation("counterfact", {
      ...existingInvitation,
      id: 202,
      login: "scim-bot",
      email: "scim-bot@example.com",
      invitation_source: "scim",
    });
    const scimInvitations = await server.fetch(
      "/orgs/counterfact/invitations?invitation_source=scim&page=1&per_page=1",
    );
    assert.equal(scimInvitations.status, 200);
    assert.deepEqual(
      ((await scimInvitations.json()) as Array<{ id: number }>).map(
        ({ id }) => id,
      ),
      [202],
    );

    const invitationTeams = await server.fetch(
      `/orgs/counterfact/invitations/${existingInvitation.id}/teams`,
    );
    assert.equal(invitationTeams.status, 200);
    assert.deepEqual(await invitationTeams.json(), []);
    await assertNotFound(
      await server.fetch("/orgs/counterfact/invitations/999/teams"),
    );
    await assertNotFound(
      await server.fetch(
        `/orgs/missing/invitations/${existingInvitation.id}/teams`,
      ),
    );

    await assertNotFound(
      await server.fetch(
        "/orgs/missing/memberships/hubot",
        json({ role: "member" }, "PUT"),
      ),
    );
    await assertNotFound(
      await server.fetch(
        "/orgs/counterfact/memberships/missing-user",
        json({ role: "member" }, "PUT"),
      ),
    );

    const setAnotherUsersPublicMembership = await server.fetch(
      "/orgs/counterfact/public_members/mona",
      { method: "PUT" },
    );
    assert.equal(setAnotherUsersPublicMembership.status, 403);
    assert.deepEqual(await setAnotherUsersPublicMembership.json(), {
      message: "Forbidden",
      status: "403",
    });
    assert.equal(
      (await server.fetch("/orgs/counterfact/public_members/mona")).status,
      204,
    );
    const removeAnotherUsersPublicMembership = await server.fetch(
      "/orgs/counterfact/public_members/mona",
      { method: "DELETE" },
    );
    assert.equal(removeAnotherUsersPublicMembership.status, 403);
    assert.deepEqual(await removeAnotherUsersPublicMembership.json(), {
      message: "Forbidden",
      status: "403",
    });
    assert.equal(
      (await server.fetch("/orgs/counterfact/public_members/mona")).status,
      204,
    );
    assert.equal(
      (
        await server.fetch("/orgs/counterfact/public_members/octocat", {
          method: "PUT",
        })
      ).status,
      204,
    );
    assert.equal(
      (await server.fetch("/orgs/counterfact/public_members/octocat")).status,
      204,
    );
    assert.equal(
      (
        await server.fetch("/orgs/counterfact/public_members/octocat", {
          method: "DELETE",
        })
      ).status,
      204,
    );
    assert.equal(
      (await server.fetch("/orgs/counterfact/public_members/octocat")).status,
      404,
    );

    await assertNotFound(
      await server.fetch("/orgs/missing/outside_collaborators/mona", {
        method: "PUT",
      }),
    );
    await assertNotFound(
      await server.fetch(
        "/orgs/counterfact/outside_collaborators/missing-user",
        {
          method: "PUT",
        },
      ),
    );
    await assertNotFound(
      await server.fetch("/orgs/counterfact/outside_collaborators/hubot", {
        method: "PUT",
      }),
    );
    assert.equal(
      (
        await server.fetch("/orgs/counterfact/outside_collaborators/mona", {
          method: "PUT",
        })
      ).status,
      204,
    );
    assert.equal(
      (await server.fetch("/orgs/counterfact/memberships/mona")).status,
      404,
    );
    assert.equal(
      (
        await server.fetch(
          "/orgs/counterfact/memberships/mona",
          json({ role: "member" }, "PUT"),
        )
      ).status,
      200,
    );
    const outsideCollaborators = await server.fetch(
      "/orgs/counterfact/outside_collaborators",
    );
    assert.equal(outsideCollaborators.status, 200);
    assert.equal(
      ((await outsideCollaborators.json()) as Array<{ login: string }>).some(
        ({ login }) => login === "mona",
      ),
      false,
    );

    const memberCannotBeRemovedAsOutsideCollaborator = await server.fetch(
      "/orgs/counterfact/outside_collaborators/mona",
      { method: "DELETE" },
    );
    assert.equal(memberCannotBeRemovedAsOutsideCollaborator.status, 422);
    assert.deepEqual(await memberCannotBeRemovedAsOutsideCollaborator.json(), {
      message:
        "You cannot specify an organization member to remove as an outside collaborator.",
      documentation_url:
        "https://docs.github.com/rest/orgs/outside-collaborators#remove-outside-collaborator-from-an-organization",
    });
    assert.equal(
      (
        await server.fetch("/orgs/counterfact/outside_collaborators/mona", {
          method: "PUT",
        })
      ).status,
      204,
    );
    assert.equal(
      (
        await server.fetch("/orgs/counterfact/outside_collaborators/mona", {
          method: "DELETE",
        })
      ).status,
      204,
    );
  } finally {
    await server.stop();
  }
});

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

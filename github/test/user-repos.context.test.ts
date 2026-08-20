import assert from "node:assert/strict";
import test from "node:test";
import { seedGitHub } from "../scenarios/index.ts";
import { createContext } from "../test-support/create-context.ts";
import type { Scenario$ } from "../types/_.context.ts";

const seededContext = () => {
  const context = createContext();
  seedGitHub({
    context,
    loadContext: () => context,
    route: () => ({}),
    routes: {},
  } as unknown as Scenario$);
  return context;
};

test("authenticated repository queries honor visibility and affiliations", () => {
  const context = seededContext();
  context.saveRepository({
    owner: "outsider",
    name: "secret",
    private: false,
  });

  assert.deepEqual(
    context.listUserRepos().map(({ full_name }) => full_name),
    [
      "counterfact/actions-demo",
      "counterfact/platform-api",
      "octocat/hello-world",
    ],
  );
  assert.deepEqual(
    context
      .listUserRepos({ affiliation: "owner" })
      .map(({ full_name }) => full_name),
    ["octocat/hello-world"],
  );
  assert.deepEqual(
    context
      .listUserRepos({ affiliation: "organization_member", sort: "full_name" })
      .map(({ full_name }) => full_name),
    ["counterfact/actions-demo", "counterfact/platform-api"],
  );
  assert.deepEqual(context.listUserRepos({ affiliation: "collaborator" }), []);
  assert.equal(
    context.addRepositoryCollaborator("outsider", "secret", "octocat"),
    true,
  );
  assert.deepEqual(
    context
      .listUserRepos({ affiliation: "collaborator" })
      .map(({ full_name }) => full_name),
    ["outsider/secret"],
  );
  assert.deepEqual(
    context.listUserRepos({ type: "owner" }).map(({ full_name }) => full_name),
    ["octocat/hello-world"],
  );
  assert.deepEqual(
    context
      .listUserRepos({ type: "member", sort: "full_name" })
      .map(({ full_name }) => full_name),
    ["counterfact/actions-demo", "counterfact/platform-api"],
  );
  assert.equal(context.listUserRepos({ type: "public" }).length, 4);
  context.updateRepository("octocat", "hello-world", { private: true });
  assert.deepEqual(
    context
      .listUserRepos({ type: "private" })
      .map(({ full_name }) => full_name),
    ["octocat/hello-world"],
  );
  assert.deepEqual(
    context
      .listUserRepos({ visibility: "private" })
      .map(({ full_name }) => full_name),
    ["octocat/hello-world"],
  );
});

test("authenticated repository queries sort, bound, and paginate by time", () => {
  const context = seededContext();
  const timestamps = [
    ["octocat", "hello-world", "2024-01-01T00:00:00Z", "2024-03-01T00:00:00Z"],
    [
      "counterfact",
      "platform-api",
      "2024-02-01T00:00:00Z",
      "2024-02-01T00:00:00Z",
    ],
    [
      "counterfact",
      "actions-demo",
      "2024-03-01T00:00:00Z",
      "2024-01-01T00:00:00Z",
    ],
  ] as const;
  for (const [owner, repo, updated_at, pushed_at] of timestamps) {
    context.updateRepository(owner, repo, {
      pushed_at,
      updated_at,
    });
  }

  assert.deepEqual(
    context
      .listUserRepos({ sort: "pushed", direction: "asc" })
      .map(({ full_name }) => full_name),
    [
      "counterfact/actions-demo",
      "counterfact/platform-api",
      "octocat/hello-world",
    ],
  );
  assert.deepEqual(
    context
      .listUserRepos({ since: "2024-02-01T00:00:00Z", sort: "full_name" })
      .map(({ full_name }) => full_name),
    ["counterfact/actions-demo"],
  );
  assert.deepEqual(
    context
      .listUserRepos({ before: "2024-02-01T00:00:00Z", sort: "full_name" })
      .map(({ full_name }) => full_name),
    ["octocat/hello-world"],
  );
  assert.deepEqual(
    context
      .listUserRepos({ sort: "full_name", per_page: 1, page: 2 })
      .map(({ full_name }) => full_name),
    ["counterfact/platform-api"],
  );
});

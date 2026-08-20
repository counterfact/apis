import assert from "node:assert/strict";
import test from "node:test";
import { createContext } from "../test-support/create-context.ts";
import {
  authenticatedUser,
  identities,
  issues,
  labels,
  notifications,
  organizationMembers,
  pullRequests,
  repositories,
} from "../scenarios/index.ts";
import type { Scenario$ } from "../types/_.context.ts";

const seededContext = () => {
  const context = createContext();
  const $ = {
    context,
    loadContext: () => context,
    route: () => ({}),
    routes: {},
  } as unknown as Scenario$;
  identities($);
  repositories($);
  organizationMembers($);
  authenticatedUser($);
  labels($);
  issues($);
  pullRequests($);
  notifications($);
  return context;
};

test("global issues aggregate repository state with filters and pagination", () => {
  const context = seededContext();
  assert.equal(
    context.listAllIssues({ filter: "all", state: "all" }).length,
    2,
  );
  assert.deepEqual(
    context
      .listAllIssues({ filter: "all", state: "closed" })
      .map(({ number }) => number),
    [2],
  );
  assert.deepEqual(
    context
      .listAllIssues({ filter: "all", labels: "enhancement" })
      .map(({ number }) => number),
    [1],
  );
  assert.equal(
    context.listAllIssues({ filter: "all", state: "all", per_page: 1, page: 2 })
      .length,
    1,
  );
  assert.deepEqual(context.listAllIssues({ filter: "assigned" }), []);

  context.saveRepository({
    owner: "outsider",
    name: "secret",
    private: true,
  });
  context.saveIssue("outsider", "secret", {
    number: 1,
    title: "Private outsider issue",
  });
  assert.equal(
    context
      .listAllIssues({ filter: "all", state: "all" })
      .some(({ title }) => title === "Private outsider issue"),
    false,
  );

  context.addRepositoryCollaborator("outsider", "secret", "octocat");
  assert.deepEqual(
    context
      .listAllIssues({
        filter: "all",
        state: "all",
        owned: false,
        orgs: false,
        collab: true,
      })
      .map(({ title }) => title),
    ["Private outsider issue"],
  );

  context.saveIssue("octocat", "hello-world", {
    number: 1,
    title: "Owned repository issue",
  });
  assert.deepEqual(
    context
      .listAllIssues({ filter: "subscribed", state: "all" })
      .map(({ title }) => title),
    ["Support stateful repository reads"],
  );
  assert.equal(
    context.listAllIssues({
      filter: "all",
      state: "all",
      owned: false,
      orgs: false,
      collab: false,
    }).length,
    0,
  );
  assert.deepEqual(
    context
      .listAllIssues({
        filter: "all",
        state: "all",
        orgs: false,
        collab: false,
      })
      .map(({ title }) => title),
    ["Owned repository issue"],
  );
  assert.equal(
    context
      .listAllIssues({ filter: "all", state: "all", owned: false })
      .some(({ title }) => title === "Owned repository issue"),
    false,
  );
  assert.ok(
    context
      .listAllIssues({ filter: "all", state: "all", pulls: true })
      .some(({ pull_request }) => Boolean(pull_request)),
  );
  assert.equal(
    context
      .listAllIssues({ filter: "all", state: "all", pulls: false })
      .some(({ pull_request }) => Boolean(pull_request)),
    false,
  );
});

test("remaining search methods return deterministic contract envelopes", () => {
  const context = seededContext();
  const users = context.searchUsers({ q: "octocat" });
  assert.equal(users.total_count, 1);
  assert.equal(users.items[0]?.login, "octocat");

  const organizations = context.searchUsers({ q: "Counterfact" });
  assert.ok(
    organizations.items.some(
      ({ login, type }) => login === "counterfact" && type === "Organization",
    ),
  );

  const commits = context.searchCommits({ q: "latest" });
  assert.ok(commits.total_count >= 1);
  assert.ok(commits.items.every(({ score }) => score === 1));

  const labelResults = context.searchLabels({
    repository_id: 102,
    q: "enhancement",
  });
  assert.equal(labelResults.total_count, 1);
  assert.equal(labelResults.items[0]?.name, "enhancement");

  assert.deepEqual(context.searchTopics({}), {
    total_count: 0,
    incomplete_results: false,
    items: [],
  });
  assert.deepEqual(context.searchCode({}), {
    total_count: 0,
    incomplete_results: false,
    items: [],
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import { createContext } from "../test-support/create-context.ts";
import {
  identities,
  issues,
  labels,
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
  labels($);
  issues($);
  return context;
};

test("global issues aggregate repository state with filters and pagination", () => {
  const context = seededContext();
  assert.equal(context.listAllIssues().length, 2);
  assert.deepEqual(
    context.listAllIssues({ state: "closed" }).map(({ number }) => number),
    [2],
  );
  assert.deepEqual(
    context
      .listAllIssues({ labels: "enhancement" })
      .map(({ number }) => number),
    [1],
  );
  assert.equal(context.listAllIssues({ per_page: 1, page: 2 }).length, 1);
  assert.deepEqual(context.listAllIssues({ filter: "assigned" }), []);
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

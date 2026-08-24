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

test("searches scope repository state and apply deterministic sort and qualifier subsets", () => {
  const context = seededContext();

  context.saveRepository({
    id: 901,
    owner: "outsider",
    name: "private-search-data",
    private: true,
  });
  const privateCommit = context.getCommit(
    "outsider",
    "private-search-data",
    "main",
  )!;
  privateCommit.commit.message = "private search needle";
  context.saveLabel("outsider", "private-search-data", {
    name: "private-search-label",
    color: "000000",
  });

  assert.equal(
    context.searchCommits({ q: "private search needle" }).total_count,
    0,
  );
  assert.deepEqual(
    context.searchLabels({ repository_id: 901, q: "private-search" }).items,
    [],
  );

  context.saveRepository({ id: 902, owner: "octocat", name: "author-first" });
  context.saveRepository({
    id: 903,
    owner: "octocat",
    name: "committer-first",
  });
  const authorFirst = context.getCommit("octocat", "author-first", "main")!;
  const committerFirst = context.getCommit(
    "octocat",
    "committer-first",
    "main",
  )!;
  authorFirst.commit.message = "distinct commit ordering";
  authorFirst.commit.author!.date = "2024-01-01T00:00:00Z";
  authorFirst.commit.committer!.date = "2024-02-01T00:00:00Z";
  committerFirst.commit.message = "distinct commit ordering";
  committerFirst.commit.author!.date = "2024-02-01T00:00:00Z";
  committerFirst.commit.committer!.date = "2024-01-01T00:00:00Z";

  assert.deepEqual(
    context
      .searchCommits({
        q: "distinct commit ordering",
        sort: "author-date",
        order: "asc",
      })
      .items.map(({ repository }) => repository.name),
    ["author-first", "committer-first"],
  );
  assert.deepEqual(
    context
      .searchCommits({
        q: "distinct commit ordering",
        sort: "committer-date",
        order: "asc",
      })
      .items.map(({ repository }) => repository.name),
    ["committer-first", "author-first"],
  );

  context.saveLabel("counterfact", "platform-api", {
    name: "label-order-first",
    color: "111111",
  });
  context.saveLabel("counterfact", "platform-api", {
    name: "label-order-second",
    color: "222222",
  });
  context.updateLabel("counterfact", "platform-api", "label-order-first", {
    name: "label-order-first-renamed",
  });

  const labelSearch = {
    repository_id: 102,
    q: "label-order",
    order: "asc",
  } as const;
  assert.deepEqual(
    context
      .searchLabels({ ...labelSearch, sort: "created" })
      .items.map(({ name }) => name),
    ["label-order-first-renamed", "label-order-second"],
  );
  assert.deepEqual(
    context
      .searchLabels({ ...labelSearch, sort: "updated" })
      .items.map(({ name }) => name),
    ["label-order-second", "label-order-first-renamed"],
  );
  assert.deepEqual(
    context
      .searchLabels({ ...labelSearch, sort: "created", per_page: 1, page: 1 })
      .items.map(({ name }) => name),
    ["label-order-first-renamed"],
  );
  assert.deepEqual(
    context
      .searchLabels({ ...labelSearch, sort: "created", per_page: 1, page: 2 })
      .items.map(({ name }) => name),
    ["label-order-second"],
  );

  context.saveUser({
    login: "sort-a",
    name: "Sort A",
    location: "Testville",
    followers: 5,
    created_at: "2023-01-01T00:00:00Z",
  });
  context.saveUser({
    login: "sort-b",
    name: "Sort B",
    location: "Testville",
    followers: 20,
    created_at: "2020-01-01T00:00:00Z",
  });
  context.saveRepository({ id: 904, owner: "sort-a", name: "one" });
  context.saveRepository({ id: 905, owner: "sort-a", name: "two" });
  context.saveRepository({ id: 906, owner: "sort-b", name: "one" });

  assert.deepEqual(
    context.searchUsers({ q: "login:octocat" }).items.map(({ login }) => login),
    ["octocat"],
  );
  assert.equal(
    context.searchUsers({ q: "login:does-not-exist" }).total_count,
    0,
  );
  assert.equal(
    context.searchUsers({ q: "language:typescript" }).total_count,
    0,
  );
  assert.deepEqual(
    context
      .searchUsers({
        q: "type:user location:Testville",
        sort: "followers",
        order: "asc",
      })
      .items.map(({ login }) => login),
    ["sort-a", "sort-b"],
  );
  assert.deepEqual(
    context
      .searchUsers({
        q: "type:user location:Testville",
        sort: "repositories",
        order: "asc",
      })
      .items.map(({ login }) => login),
    ["sort-b", "sort-a"],
  );
  assert.deepEqual(
    context
      .searchUsers({
        q: "type:user location:Testville",
        sort: "joined",
        order: "asc",
      })
      .items.map(({ login }) => login),
    ["sort-b", "sort-a"],
  );
  assert.deepEqual(
    context
      .searchUsers({ q: "followers:>=20 repositories:=1" })
      .items.map(({ login }) => login),
    ["sort-b"],
  );
});

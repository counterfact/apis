import assert from "node:assert/strict";
import test from "node:test";
import type { Context$ } from "../types/_.context.ts";
import { Context } from "../routes/users/_.context.ts";

type RepositorySummary = {
  owner: { login: string };
  private: boolean;
};

const createContext = () => {
  const repositories: Array<RepositorySummary> = [];
  const rootContext = {
    listRepositories: () => repositories,
  };

  const context = new Context({
    loadContext: ((path: string) => {
      if (path !== "/") {
        throw new Error(`Unknown context path: ${path}`);
      }
      return rootContext;
    }) as Context$["loadContext"],
    readJson: async () => ({}),
  });

  return { context, repositories };
};

test("Context.saveUser assigns an id and derives repository counts", () => {
  const { context, repositories } = createContext();

  context.saveUser({ login: "octocat", name: "Octocat" });
  repositories.push(
    { owner: { login: "octocat" }, private: false },
    { owner: { login: "octocat" }, private: true },
    { owner: { login: "mona" }, private: false },
  );

  const user = context.getUser("octocat");
  assert.ok(user, "saved user should be returned");
  assert.equal(user?.id, 100);
  assert.equal(user?.name, "Octocat");
  assert.equal(user?.public_repos, 1);
  assert.equal(user?.total_private_repos, 1);
  assert.equal(user?.owned_private_repos, 1);
});

test("Context.listUsers and listSimpleUsers respect since and per_page", () => {
  const { context } = createContext();

  context.saveUser({ id: 2, login: "mona", name: "Mona" });
  context.saveUser({ id: 4, login: "octocat", name: "Octocat" });
  context.saveUser({ id: 6, login: "hubot", name: "Hubot" });

  const pagedUsers = context.listUsers({ since: 2, per_page: 1 });
  assert.equal(pagedUsers.length, 1);
  assert.equal(pagedUsers[0].login, "octocat");

  const simpleUsers = context.listSimpleUsers({ per_page: 2 });
  assert.deepEqual(
    simpleUsers.map((user) => user.login),
    ["mona", "octocat"],
  );
});

test("Context.saveOrganization and listSimpleOrganizations derive repository counts", () => {
  const { context, repositories } = createContext();

  context.saveOrganization({ login: "counterfact", name: "Counterfact" });
  context.saveOrganization({ login: "examples", name: "Examples" });
  repositories.push(
    { owner: { login: "counterfact" }, private: false },
    { owner: { login: "counterfact" }, private: true },
    { owner: { login: "examples" }, private: false },
  );

  const organization = context.getOrganization("counterfact");
  assert.ok(organization, "saved organization should be returned");
  assert.equal(organization?.public_repos, 1);
  assert.equal(organization?.total_private_repos, 1);
  assert.equal(organization?.owned_private_repos, 1);

  const simpleOrganizations = context.listSimpleOrganizations({ per_page: 1 });
  assert.equal(simpleOrganizations.length, 1);
  assert.equal(simpleOrganizations[0].login, "counterfact");
});

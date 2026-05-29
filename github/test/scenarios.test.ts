import assert from "node:assert/strict";
import test from "node:test";
import {
  actions,
  gistComments,
  gists,
  identities,
  issues,
  pullRequests,
  repositories,
  seedGitHub,
} from "../scenarios/index.ts";
import { createContextHarness } from "../test-support/create-context.ts";

const createScenario$ = () => {
  const { context, loadContext } = createContextHarness();
  return {
    context,
    loadContext,
    routes: {},
    route: () => ({}),
  };
};

test("gists scenario seeds sample gist data", () => {
  const $ = createScenario$();

  gists($);

  const allGists = $.context.listGists();
  assert.equal(allGists.length, 3);

  const rubyGist = $.context.getGist("aa5a315d61ae9438b18d");
  assert.ok(rubyGist, "Ruby gist should exist");
  assert.equal(rubyGist.description, "Hello World Ruby");
  assert.equal(rubyGist.public, true);
  assert.ok(rubyGist.files?.["hello_world.rb"]);

  const pythonGist = $.context.getGist("b5a5ce3049c14e426f30");
  assert.ok(pythonGist, "Python gist should exist");
  assert.equal(pythonGist.description, "Hello World Python");
  assert.ok(pythonGist.files?.["hello_world.py"]);
  assert.ok(pythonGist.files?.["README.md"]);

  const secretGist = $.context.getGist("c6db0bec360bb87e9418");
  assert.ok(secretGist, "Secret gist should exist");
  assert.equal(secretGist.public, false);
});

test("gists scenario produces correct public/private split", () => {
  const $ = createScenario$();

  gists($);

  assert.equal($.context.listPublicGists().length, 2);
});

test("gistComments scenario seeds comments on existing gists", () => {
  const $ = createScenario$();

  gists($);
  gistComments($);

  const rubyComments = $.context.listComments("aa5a315d61ae9438b18d");
  assert.equal(rubyComments.length, 1);
  assert.equal(rubyComments[0].body, "Great Ruby snippet!");

  const pythonComments = $.context.listComments("b5a5ce3049c14e426f30");
  assert.equal(pythonComments.length, 1);
  assert.equal(pythonComments[0].body, "Classic Python example.");
});

test("identity and repository scenarios seed users, orgs, and repos", () => {
  const $ = createScenario$();

  identities($);
  repositories($);

  assert.equal($.context.getUser("octocat")?.name, "The Octocat");
  assert.equal(
    $.context.getOrganization("counterfact")?.description,
    "API simulator fixtures for local integration testing",
  );
  assert.equal($.context.listRepositories().length, 3);
  assert.equal(
    $.context.getRepository("counterfact", "platform-api")?.default_branch,
    "main",
  );
});

test("issues, pull requests, and actions scenarios seed related data", () => {
  const $ = createScenario$();

  identities($);
  repositories($);
  issues($);
  pullRequests($);
  actions($);

  assert.equal(
    $.context.listIssues("counterfact", "platform-api", { state: "all" })
      .length,
    2,
  );
  assert.equal(
    $.context.listIssueComments("counterfact", "platform-api", 1).length,
    1,
  );
  assert.equal(
    $.context.listPullRequests("counterfact", "platform-api").length,
    1,
  );
  assert.equal(
    $.context.listPullRequestReviews("counterfact", "platform-api", 1).length,
    1,
  );
  assert.equal(
    $.context.listWorkflows("counterfact", "actions-demo").length,
    2,
  );
  assert.equal(
    $.context.listWorkflowRuns("counterfact", "actions-demo").length,
    2,
  );
  assert.equal(
    $.context.listWorkflowJobs("counterfact", "actions-demo", 401).length,
    2,
  );
});

test("seedGitHub seeds all new GitHub domains together", () => {
  const $ = createScenario$();

  seedGitHub($);

  assert.equal($.context.listGists().length, 3);
  assert.equal($.context.listRepositories().length, 3);
  assert.equal(
    $.context.listIssues("counterfact", "platform-api", { state: "all" })
      .length,
    2,
  );
  assert.equal(
    $.context.listPullRequests("counterfact", "platform-api").length,
    1,
  );
  assert.equal(
    $.context.listWorkflows("counterfact", "actions-demo").length,
    2,
  );
  assert.equal($.context.getUser("mona")?.login, "mona");
  assert.equal($.context.getOrganization("counterfact")?.login, "counterfact");
  assert.equal($.context.listComments("aa5a315d61ae9438b18d").length, 1);
});

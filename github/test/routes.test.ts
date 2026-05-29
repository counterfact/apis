import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../routes/_.context.ts";
import { GET as getWorkflowJobs } from "../routes/repos/{owner}/{repo}/actions/runs/{run_id}/jobs.ts";
import { GET as getWorkflowRuns } from "../routes/repos/{owner}/{repo}/actions/runs.ts";
import { GET as getWorkflows } from "../routes/repos/{owner}/{repo}/actions/workflows.ts";
import { GET as getBranch } from "../routes/repos/{owner}/{repo}/branches/{branch}.ts";
import {
  GET as getIssueComments,
  POST as postIssueComment,
} from "../routes/repos/{owner}/{repo}/issues/{issue_number}/comments.ts";
import {
  GET as getIssue,
  PATCH as patchIssue,
} from "../routes/repos/{owner}/{repo}/issues/{issue_number}.ts";
import {
  GET as getIssues,
  POST as postIssue,
} from "../routes/repos/{owner}/{repo}/issues.ts";
import {
  GET as getPullReviews,
  POST as postPullReview,
} from "../routes/repos/{owner}/{repo}/pulls/{pull_number}/reviews.ts";
import {
  GET as getPull,
  PATCH as patchPull,
} from "../routes/repos/{owner}/{repo}/pulls/{pull_number}.ts";
import {
  GET as getPulls,
  POST as postPull,
} from "../routes/repos/{owner}/{repo}/pulls.ts";
import { GET as getReadme } from "../routes/repos/{owner}/{repo}/readme.ts";
import {
  GET as getRepo,
  PATCH as patchRepo,
} from "../routes/repos/{owner}/{repo}.ts";
import { GET as getSearchIssues } from "../routes/search/issues.ts";
import { GET as getSearchRepos } from "../routes/search/repositories.ts";
import {
  GET as getOrgRepos,
  POST as postOrgRepo,
} from "../routes/orgs/{org}/repos.ts";
import { GET as getOrg } from "../routes/orgs/{org}.ts";
import {
  GET as getUserRepos,
  POST as postUserRepo,
} from "../routes/user/repos.ts";
import { GET as getUser } from "../routes/users/{username}.ts";
import { seedGitHub } from "../scenarios/index.ts";

type RouteResult = { status: number; body?: unknown };

const createResponse = () =>
  new Proxy(
    {},
    {
      get: (_, key) => ({
        json: (body: unknown): RouteResult => ({ status: Number(key), body }),
        empty: (): RouteResult => ({ status: Number(key) }),
        random: (): RouteResult => ({ status: Number(key) }),
      }),
    },
  ) as never;

const create$ = ({
  context,
  path = {},
  body = {},
  query = {},
}: {
  context: Context;
  path?: Record<string, unknown>;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
}) => ({
  context,
  path,
  body,
  query,
  response: createResponse(),
});

const createSeededContext = () => {
  const context = new Context({} as never);
  seedGitHub({
    context,
    loadContext: () => context,
    routes: {},
    route: () => ({}),
  });
  return context;
};

test("repository routes list, create, fetch, update, branch, and readme data", async () => {
  const context = createSeededContext();

  const userRepos = (await getUserRepos(
    create$({ context, query: { visibility: "all" } }) as never,
  )) as RouteResult;
  assert.equal(userRepos.status, 200);
  assert.ok(Array.isArray(userRepos.body));
  assert.equal((userRepos.body as Array<unknown>).length, 3);

  const created = (await postUserRepo(
    create$({
      context,
      body: {
        name: "new-repo",
        description: "Created via route",
        auto_init: true,
      },
    }) as never,
  )) as RouteResult;
  assert.equal(created.status, 201);
  assert.equal(
    (created.body as { full_name: string }).full_name,
    "octocat/new-repo",
  );

  const orgCreated = (await postOrgRepo(
    create$({
      context,
      path: { org: "counterfact" },
      body: { name: "org-repo", description: "Organization repo" },
    }) as never,
  )) as RouteResult;
  assert.equal(orgCreated.status, 201);

  const repo = (await getRepo(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
    }) as never,
  )) as RouteResult;
  assert.equal(repo.status, 200);
  assert.equal(
    (repo.body as { full_name: string }).full_name,
    "counterfact/platform-api",
  );

  const patched = (await patchRepo(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      body: { description: "Updated description" },
    }) as never,
  )) as RouteResult;
  assert.equal(
    (patched.body as { description: string }).description,
    "Updated description",
  );

  const branch = (await getBranch(
    create$({
      context,
      path: {
        owner: "counterfact",
        repo: "platform-api",
        branch: "feature-routing",
      },
    }) as never,
  )) as RouteResult;
  assert.equal((branch.body as { name: string }).name, "feature-routing");

  const readme = (await getReadme(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
    }) as never,
  )) as RouteResult;
  assert.equal((readme.body as { name: string }).name, "README.md");

  const orgRepos = (await getOrgRepos(
    create$({ context, path: { org: "counterfact" } }) as never,
  )) as RouteResult;
  assert.equal((orgRepos.body as Array<unknown>).length >= 2, true);
});

test("issue routes manage issue lifecycle and comments", async () => {
  const context = createSeededContext();

  const listed = (await getIssues(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      query: { state: "all" },
    }) as never,
  )) as RouteResult;
  assert.equal((listed.body as Array<unknown>).length, 2);

  const created = (await postIssue(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      body: { title: "Route-created issue", body: "Created in tests" },
    }) as never,
  )) as RouteResult;
  assert.equal(created.status, 201);
  assert.equal((created.body as { number: number }).number, 3);

  const issue = (await getIssue(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", issue_number: 1 },
    }) as never,
  )) as RouteResult;
  assert.equal(
    (issue.body as { title: string }).title,
    "Support stateful repository reads",
  );

  const patched = (await patchIssue(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", issue_number: 1 },
      body: { state: "closed", state_reason: "completed" },
    }) as never,
  )) as RouteResult;
  assert.equal((patched.body as { state: string }).state, "closed");

  const comment = (await postIssueComment(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", issue_number: 1 },
      body: { body: "Route comment" },
    }) as never,
  )) as RouteResult;
  assert.equal(comment.status, 201);

  const comments = (await getIssueComments(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", issue_number: 1 },
    }) as never,
  )) as RouteResult;
  assert.equal((comments.body as Array<unknown>).length, 2);
});

test("pull request routes manage reviews and updates", async () => {
  const context = createSeededContext();

  const listed = (await getPulls(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
    }) as never,
  )) as RouteResult;
  assert.equal((listed.body as Array<unknown>).length, 1);

  const created = (await postPull(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      body: {
        title: "Route-created PR",
        head: "octocat:feature-routing",
        base: "main",
        body: "Opens from route test",
      },
    }) as never,
  )) as RouteResult;
  assert.equal(created.status, 201);
  assert.equal((created.body as { number: number }).number, 2);

  const pull = (await getPull(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", pull_number: 1 },
    }) as never,
  )) as RouteResult;
  assert.equal(
    (pull.body as { title: string }).title,
    "Implement stateful repository fixtures",
  );

  const updated = (await patchPull(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", pull_number: 1 },
      body: { state: "closed" },
    }) as never,
  )) as RouteResult;
  assert.equal((updated.body as { state: string }).state, "closed");

  const review = (await postPullReview(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", pull_number: 1 },
      body: { body: "Approved", event: "APPROVE" },
    }) as never,
  )) as RouteResult;
  assert.equal(review.status, 200);

  const reviews = (await getPullReviews(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", pull_number: 1 },
    }) as never,
  )) as RouteResult;
  assert.equal((reviews.body as Array<unknown>).length, 2);
});

test("actions, identity, and search routes return seeded data", async () => {
  const context = createSeededContext();

  const workflows = (await getWorkflows(
    create$({
      context,
      path: { owner: "counterfact", repo: "actions-demo" },
    }) as never,
  )) as RouteResult;
  assert.equal((workflows.body as { total_count: number }).total_count, 2);

  const runs = (await getWorkflowRuns(
    create$({
      context,
      path: { owner: "counterfact", repo: "actions-demo" },
      query: { status: "completed" },
    }) as never,
  )) as RouteResult;
  assert.equal((runs.body as { total_count: number }).total_count, 2);

  const jobs = (await getWorkflowJobs(
    create$({
      context,
      path: { owner: "counterfact", repo: "actions-demo", run_id: 401 },
    }) as never,
  )) as RouteResult;
  assert.equal((jobs.body as { total_count: number }).total_count, 2);

  const user = (await getUser(
    create$({ context, path: { username: "mona" } }) as never,
  )) as RouteResult;
  assert.equal((user.body as { login: string }).login, "mona");

  const org = (await getOrg(
    create$({ context, path: { org: "counterfact" } }) as never,
  )) as RouteResult;
  assert.equal((org.body as { login: string }).login, "counterfact");

  const repoSearch = (await getSearchRepos(
    create$({
      context,
      query: { q: "platform repo:counterfact/platform-api" },
    }) as never,
  )) as RouteResult;
  assert.equal((repoSearch.body as { total_count: number }).total_count, 1);

  const issueSearch = (await getSearchIssues(
    create$({
      context,
      query: { q: "stateful repo:counterfact/platform-api is:issue" },
    }) as never,
  )) as RouteResult;
  assert.equal((issueSearch.body as { total_count: number }).total_count, 1);
});

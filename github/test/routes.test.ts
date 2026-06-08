import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { Context } from "../routes/_.context.ts";
import { GET as getWorkflowJobs } from "../routes/repos/{owner}/{repo}/actions/runs/{run_id}/jobs.ts";
import { GET as getWorkflowRuns } from "../routes/repos/{owner}/{repo}/actions/runs.ts";
import { GET as getWorkflows } from "../routes/repos/{owner}/{repo}/actions/workflows.ts";
import { GET as getBranch } from "../routes/repos/{owner}/{repo}/branches/{branch}.ts";
import { GET as getCommit } from "../routes/repos/{owner}/{repo}/commits/{ref}.ts";
import {
  GET as getCommitComments,
  POST as postCommitComment,
} from "../routes/repos/{owner}/{repo}/commits/{commit_sha}/comments.ts";
import { GET as getCombinedCommitStatus } from "../routes/repos/{owner}/{repo}/commits/{ref}/status.ts";
import { GET as getCommitStatuses } from "../routes/repos/{owner}/{repo}/commits/{ref}/statuses.ts";
import { GET as getCommits } from "../routes/repos/{owner}/{repo}/commits.ts";
import {
  GET as getIssueComments,
  POST as postIssueComment,
} from "../routes/repos/{owner}/{repo}/issues/{issue_number}/comments.ts";
import {
  GET as getIssueLabels,
  POST as postIssueLabels,
  PUT as putIssueLabels,
  DELETE as deleteIssueLabels,
} from "../routes/repos/{owner}/{repo}/issues/{issue_number}/labels.ts";
import { DELETE as deleteIssueLabel } from "../routes/repos/{owner}/{repo}/issues/{issue_number}/labels/{name}.ts";
import {
  GET as getIssue,
  PATCH as patchIssue,
} from "../routes/repos/{owner}/{repo}/issues/{issue_number}.ts";
import {
  GET as getIssues,
  POST as postIssue,
} from "../routes/repos/{owner}/{repo}/issues.ts";
import {
  GET as getMilestone,
  PATCH as patchMilestone,
  DELETE as deleteMilestone,
} from "../routes/repos/{owner}/{repo}/milestones/{milestone_number}.ts";
import {
  GET as getMilestones,
  POST as postMilestone,
} from "../routes/repos/{owner}/{repo}/milestones.ts";
import {
  GET as getLabel,
  PATCH as patchLabel,
  DELETE as deleteLabel,
} from "../routes/repos/{owner}/{repo}/labels/{name}.ts";
import {
  GET as getLabels,
  POST as postLabel,
} from "../routes/repos/{owner}/{repo}/labels.ts";
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
import {
  GET as getReleases,
  POST as postRelease,
} from "../routes/repos/{owner}/{repo}/releases.ts";
import {
  GET as getRelease,
  PATCH as patchRelease,
  DELETE as deleteRelease,
} from "../routes/repos/{owner}/{repo}/releases/{release_id}.ts";
import { GET as getLatestRelease } from "../routes/repos/{owner}/{repo}/releases/latest.ts";
import { GET as getReleaseByTag } from "../routes/repos/{owner}/{repo}/releases/tags/{tag}.ts";
import {
  GET as getNotifications,
  PUT as putNotifications,
} from "../routes/notifications.ts";
import {
  GET as getThread,
  PATCH as patchThread,
  DELETE as deleteThread,
} from "../routes/notifications/threads/{thread_id}.ts";
import {
  GET as getThreadSubscription,
  PUT as putThreadSubscription,
  DELETE as deleteThreadSubscription,
} from "../routes/notifications/threads/{thread_id}/subscription.ts";
import {
  GET as getRepoNotifications,
  PUT as putRepoNotifications,
} from "../routes/repos/{owner}/{repo}/notifications.ts";
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
import { createContextHarness } from "../test-support/create-context.ts";

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
  const { context, loadContext } = createContextHarness();
  seedGitHub({
    context,
    loadContext,
    routes: {},
    route: () => ({}),
  });
  return context;
};

const startCommitRoutesHttpServer = async () => {
  const context = createSeededContext();
  const server = createServer(async (req, res) => {
    const method = req.method ?? "GET";
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const query = Object.fromEntries(url.searchParams.entries());
    const path = url.pathname;

    let result: RouteResult | undefined;

    const statusesMatch = path.match(
      /^\/repos\/([^/]+)\/([^/]+)\/commits\/([^/]+)\/statuses$/,
    );
    if (method === "GET" && statusesMatch) {
      const [, owner, repo, ref] = statusesMatch;
      result = (await getCommitStatuses(
        create$({ context, path: { owner, repo, ref }, query }) as never,
      )) as RouteResult;
    }

    const statusMatch = path.match(
      /^\/repos\/([^/]+)\/([^/]+)\/commits\/([^/]+)\/status$/,
    );
    if (!result && method === "GET" && statusMatch) {
      const [, owner, repo, ref] = statusMatch;
      result = (await getCombinedCommitStatus(
        create$({ context, path: { owner, repo, ref } }) as never,
      )) as RouteResult;
    }

    const commentsMatch = path.match(
      /^\/repos\/([^/]+)\/([^/]+)\/commits\/([^/]+)\/comments$/,
    );
    if (!result && commentsMatch) {
      const [, owner, repo, commit_sha] = commentsMatch;
      if (method === "GET") {
        result = (await getCommitComments(
          create$({
            context,
            path: { owner, repo, commit_sha },
            query,
          }) as never,
        )) as RouteResult;
      }
      if (method === "POST") {
        const chunks: Uint8Array[] = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const bodyText = Buffer.concat(chunks).toString("utf8");
        const body = bodyText
          ? (JSON.parse(bodyText) as Record<string, unknown>)
          : {};
        result = (await postCommitComment(
          create$({
            context,
            path: { owner, repo, commit_sha },
            body,
          }) as never,
        )) as RouteResult;
      }
    }

    const commitMatch = path.match(
      /^\/repos\/([^/]+)\/([^/]+)\/commits\/([^/]+)$/,
    );
    if (!result && method === "GET" && commitMatch) {
      const [, owner, repo, ref] = commitMatch;
      result = (await getCommit(
        create$({ context, path: { owner, repo, ref } }) as never,
      )) as RouteResult;
    }

    const commitsMatch = path.match(/^\/repos\/([^/]+)\/([^/]+)\/commits$/);
    if (!result && method === "GET" && commitsMatch) {
      const [, owner, repo] = commitsMatch;
      result = (await getCommits(
        create$({ context, path: { owner, repo }, query }) as never,
      )) as RouteResult;
    }

    if (!result) {
      res.statusCode = 404;
      res.end();
      return;
    }

    res.statusCode = result.status;
    if (result.body === undefined) {
      res.end();
      return;
    }

    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(result.body));
  });

  await new Promise<void>((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => resolve());
    server.on("error", reject);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("failed to determine HTTP test server address");
  }

  return {
    request: (pathname: string, init?: RequestInit) =>
      fetch(`http://127.0.0.1:${address.port}${pathname}`, init),
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      }),
  };
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

test("milestone routes manage milestone lifecycle", async () => {
  const context = createSeededContext();

  const listed = (await getMilestones(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      query: { state: "all" },
    }) as never,
  )) as RouteResult;
  assert.equal((listed.body as Array<unknown>).length, 2);

  const openOnly = (await getMilestones(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      query: { state: "open" },
    }) as never,
  )) as RouteResult;
  assert.equal((openOnly.body as Array<unknown>).length, 1);

  const created = (await postMilestone(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      body: { title: "v1.1", description: "Next milestone" },
    }) as never,
  )) as RouteResult;
  assert.equal(created.status, 201);
  assert.equal((created.body as { number: number }).number, 3);

  const fetched = (await getMilestone(
    create$({
      context,
      path: {
        owner: "counterfact",
        repo: "platform-api",
        milestone_number: 1,
      },
    }) as never,
  )) as RouteResult;
  assert.equal((fetched.body as { title: string }).title, "v1.0");

  const patched = (await patchMilestone(
    create$({
      context,
      path: {
        owner: "counterfact",
        repo: "platform-api",
        milestone_number: 1,
      },
      body: { title: "v1.0.1", state: "closed" },
    }) as never,
  )) as RouteResult;
  assert.equal((patched.body as { title: string }).title, "v1.0.1");
  assert.equal((patched.body as { state: string }).state, "closed");

  const deleted = (await deleteMilestone(
    create$({
      context,
      path: {
        owner: "counterfact",
        repo: "platform-api",
        milestone_number: 3,
      },
    }) as never,
  )) as RouteResult;
  assert.equal(deleted.status, 204);
});

test("label routes manage repository and issue labels", async () => {
  const context = createSeededContext();

  const listed = (await getLabels(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
    }) as never,
  )) as RouteResult;
  assert.equal(listed.status, 200);
  assert.deepEqual(
    (listed.body as Array<{ name: string }>).map((item) => item.name),
    ["bug", "enhancement", "documentation", "question"],
  );

  const created = (await postLabel(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      body: {
        name: "triage",
        color: "fbca04",
        description: "Needs triage",
      },
    }) as never,
  )) as RouteResult;
  assert.equal(created.status, 201);
  assert.equal((created.body as { name: string }).name, "triage");

  const fetched = (await getLabel(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", name: "triage" },
    }) as never,
  )) as RouteResult;
  assert.equal(fetched.status, 200);

  const patched = (await patchLabel(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", name: "triage" },
      body: { new_name: "needs-triage", color: "c2e0c6" },
    }) as never,
  )) as RouteResult;
  assert.equal((patched.body as { name: string }).name, "needs-triage");

  const issueLabels = (await getIssueLabels(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", issue_number: 1 },
    }) as never,
  )) as RouteResult;
  assert.deepEqual(
    (issueLabels.body as Array<{ name: string }>).map((item) => item.name),
    ["enhancement"],
  );

  const added = (await postIssueLabels(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", issue_number: 1 },
      body: { labels: ["bug", "needs-triage"] },
    }) as never,
  )) as RouteResult;
  assert.deepEqual(
    (added.body as Array<{ name: string }>).map((item) => item.name),
    ["enhancement", "bug", "needs-triage"],
  );

  const replaced = (await putIssueLabels(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", issue_number: 1 },
      body: ["question"],
    }) as never,
  )) as RouteResult;
  assert.deepEqual(
    (replaced.body as Array<{ name: string }>).map((item) => item.name),
    ["question"],
  );

  const removed = (await deleteIssueLabel(
    create$({
      context,
      path: {
        owner: "counterfact",
        repo: "platform-api",
        issue_number: 1,
        name: "question",
      },
    }) as never,
  )) as RouteResult;
  assert.deepEqual(removed.body, []);

  const cleared = (await deleteIssueLabels(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", issue_number: 1 },
    }) as never,
  )) as RouteResult;
  assert.equal(cleared.status, 204);

  const deleted = (await deleteLabel(
    create$({
      context,
      path: {
        owner: "counterfact",
        repo: "platform-api",
        name: "needs-triage",
      },
    }) as never,
  )) as RouteResult;
  assert.equal(deleted.status, 204);
});

test("label routes return 404 when the repository or issue does not exist", async () => {
  const context = createSeededContext();
  const missingRepo = { owner: "nobody", repo: "missing" };

  assert.equal(
    (
      (await getLabels(
        create$({ context, path: missingRepo }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await postLabel(
        create$({
          context,
          path: missingRepo,
          body: { name: "bug", color: "d73a4a" },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await getLabel(
        create$({ context, path: { ...missingRepo, name: "bug" } }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await patchLabel(
        create$({
          context,
          path: { ...missingRepo, name: "bug" },
          body: { color: "000000" },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await deleteLabel(
        create$({ context, path: { ...missingRepo, name: "bug" } }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await getIssueLabels(
        create$({
          context,
          path: {
            owner: "counterfact",
            repo: "platform-api",
            issue_number: 999,
          },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await postIssueLabels(
        create$({
          context,
          path: {
            owner: "counterfact",
            repo: "platform-api",
            issue_number: 999,
          },
          body: { labels: ["bug"] },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await putIssueLabels(
        create$({
          context,
          path: {
            owner: "counterfact",
            repo: "platform-api",
            issue_number: 999,
          },
          body: [],
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await deleteIssueLabels(
        create$({
          context,
          path: {
            owner: "counterfact",
            repo: "platform-api",
            issue_number: 999,
          },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await deleteIssueLabel(
        create$({
          context,
          path: {
            owner: "counterfact",
            repo: "platform-api",
            issue_number: 999,
            name: "bug",
          },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
});

test("milestone routes return 404 when repository or milestone does not exist", async () => {
  const context = createSeededContext();

  assert.equal(
    (
      (await getMilestones(
        create$({
          context,
          path: { owner: "nobody", repo: "missing" },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await postMilestone(
        create$({
          context,
          path: { owner: "nobody", repo: "missing" },
          body: { title: "v1.0" },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await getMilestone(
        create$({
          context,
          path: {
            owner: "counterfact",
            repo: "platform-api",
            milestone_number: 999,
          },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await patchMilestone(
        create$({
          context,
          path: {
            owner: "counterfact",
            repo: "platform-api",
            milestone_number: 999,
          },
          body: { title: "x" },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
  assert.equal(
    (
      (await deleteMilestone(
        create$({
          context,
          path: {
            owner: "counterfact",
            repo: "platform-api",
            milestone_number: 999,
          },
        }) as never,
      )) as RouteResult
    ).status,
    404,
  );
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

test("commit routes list commits, fetch refs, comments, and statuses", async () => {
  const server = await startCommitRoutesHttpServer();
  try {
    const listed = await server.request(
      "/repos/counterfact/actions-demo/commits",
    );
    assert.equal(listed.status, 200);
    assert.ok(((await listed.json()) as Array<unknown>).length >= 1);

    const byBranch = await server.request(
      "/repos/counterfact/actions-demo/commits/main",
    );
    assert.equal(byBranch.status, 200);
    const sha = ((await byBranch.json()) as { sha: string }).sha;

    const commentsBefore = await server.request(
      `/repos/counterfact/actions-demo/commits/${sha}/comments`,
    );
    assert.equal(((await commentsBefore.json()) as Array<unknown>).length, 0);

    const createdComment = await server.request(
      `/repos/counterfact/actions-demo/commits/${sha}/comments`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          body: "Nice commit",
          path: "README.md",
          line: 1,
        }),
      },
    );
    assert.equal(createdComment.status, 201);

    await server.request(
      `/repos/counterfact/actions-demo/commits/${sha}/comments`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: "Another comment" }),
      },
    );
    await server.request(
      `/repos/counterfact/actions-demo/commits/${sha}/comments`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: "Third comment" }),
      },
    );

    const commentsAfter = await server.request(
      `/repos/counterfact/actions-demo/commits/${sha}/comments`,
    );
    assert.equal(((await commentsAfter.json()) as Array<unknown>).length, 3);

    const pagedComments1 = await server.request(
      `/repos/counterfact/actions-demo/commits/${sha}/comments?per_page=2&page=1`,
    );
    const pagedComments2 = await server.request(
      `/repos/counterfact/actions-demo/commits/${sha}/comments?per_page=2&page=2`,
    );
    assert.equal(((await pagedComments1.json()) as Array<unknown>).length, 2);
    assert.equal(((await pagedComments2.json()) as Array<unknown>).length, 1);

    const combinedStatus = await server.request(
      "/repos/counterfact/actions-demo/commits/main/status",
    );
    assert.equal(
      ((await combinedStatus.json()) as { state: string }).state,
      "success",
    );

    const statuses = await server.request(
      "/repos/counterfact/actions-demo/commits/main/statuses",
    );
    assert.equal(((await statuses.json()) as Array<unknown>).length, 2);

    const pagedStatuses1 = await server.request(
      "/repos/counterfact/actions-demo/commits/main/statuses?per_page=1&page=1",
    );
    const pagedStatuses2 = await server.request(
      "/repos/counterfact/actions-demo/commits/main/statuses?per_page=1&page=2",
    );
    assert.equal(((await pagedStatuses1.json()) as Array<unknown>).length, 1);
    assert.equal(((await pagedStatuses2.json()) as Array<unknown>).length, 1);
  } finally {
    await server.close();
  }
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

test("commit routes return 404 when repository does not exist", async () => {
  const server = await startCommitRoutesHttpServer();
  try {
    const commits = await server.request("/repos/nobody/missing/commits");
    assert.equal(commits.status, 404);

    const commit = await server.request("/repos/nobody/missing/commits/main");
    assert.equal(commit.status, 404);

    const comments = await server.request(
      "/repos/nobody/missing/commits/abc123/comments",
    );
    assert.equal(comments.status, 404);

    const created = await server.request(
      "/repos/nobody/missing/commits/abc123/comments",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: "x" }),
      },
    );
    assert.equal(created.status, 404);

    const combined = await server.request(
      "/repos/nobody/missing/commits/main/status",
    );
    assert.equal(combined.status, 404);

    const statuses = await server.request(
      "/repos/nobody/missing/commits/main/statuses",
    );
    assert.equal(statuses.status, 404);
  } finally {
    await server.close();
  }
});

test("release routes manage the full release lifecycle", async () => {
  const context = createSeededContext();

  // GET /repos/:owner/:repo/releases returns the seeded list
  const listed = (await getReleases(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
    }) as never,
  )) as RouteResult;
  assert.equal(listed.status, 200);
  assert.equal((listed.body as Array<unknown>).length, 3);

  // POST /repos/:owner/:repo/releases creates and returns 201
  const created = (await postRelease(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      body: { tag_name: "v3.0.0", name: "Version 3.0.0", body: "New release" },
    }) as never,
  )) as RouteResult;
  assert.equal(created.status, 201);
  assert.equal((created.body as { tag_name: string }).tag_name, "v3.0.0");
  const newId = (created.body as { id: number }).id;

  // GET /repos/:owner/:repo/releases/:id returns the release
  const fetched = (await getRelease(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", release_id: newId },
    }) as never,
  )) as RouteResult;
  assert.equal(fetched.status, 200);
  assert.equal((fetched.body as { tag_name: string }).tag_name, "v3.0.0");

  // PATCH /repos/:owner/:repo/releases/:id updates and returns 200
  const patched = (await patchRelease(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", release_id: newId },
      body: { name: "Version 3.0.0 (updated)" },
    }) as never,
  )) as RouteResult;
  assert.equal(patched.status, 200);
  assert.equal(
    (patched.body as { name: string }).name,
    "Version 3.0.0 (updated)",
  );

  // DELETE /repos/:owner/:repo/releases/:id returns 204
  const deleted = (await deleteRelease(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api", release_id: newId },
    }) as never,
  )) as RouteResult;
  assert.equal(deleted.status, 204);

  // GET /repos/:owner/:repo/releases/latest returns the latest stable release
  const latest = (await getLatestRelease(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
    }) as never,
  )) as RouteResult;
  assert.equal(latest.status, 200);
  assert.equal((latest.body as { tag_name: string }).tag_name, "v1.0.0");

  // GET /repos/:owner/:repo/releases/tags/:tag returns the matching release
  const byTag = (await getReleaseByTag(
    create$({
      context,
      path: {
        owner: "counterfact",
        repo: "platform-api",
        tag: "v2.0.0-beta.1",
      },
    }) as never,
  )) as RouteResult;
  assert.equal(byTag.status, 200);
  assert.equal((byTag.body as { tag_name: string }).tag_name, "v2.0.0-beta.1");
});

test("release routes return 404 when repository does not exist", async () => {
  const context = createSeededContext();
  const missingPath = { owner: "nobody", repo: "missing" };

  const listed = (await getReleases(
    create$({ context, path: missingPath }) as never,
  )) as RouteResult;
  assert.equal(listed.status, 404);

  const created = (await postRelease(
    create$({
      context,
      path: missingPath,
      body: { tag_name: "v1.0.0" },
    }) as never,
  )) as RouteResult;
  assert.equal(created.status, 404);

  const fetched = (await getRelease(
    create$({
      context,
      path: { ...missingPath, release_id: 1 },
    }) as never,
  )) as RouteResult;
  assert.equal(fetched.status, 404);

  const patched = (await patchRelease(
    create$({
      context,
      path: { ...missingPath, release_id: 1 },
      body: { name: "x" },
    }) as never,
  )) as RouteResult;
  assert.equal(patched.status, 404);

  const deleted = (await deleteRelease(
    create$({
      context,
      path: { ...missingPath, release_id: 1 },
    }) as never,
  )) as RouteResult;
  assert.equal(deleted.status, 404);

  const latest = (await getLatestRelease(
    create$({ context, path: missingPath }) as never,
  )) as RouteResult;
  assert.equal(latest.status, 404);

  const byTag = (await getReleaseByTag(
    create$({
      context,
      path: { ...missingPath, tag: "v1.0.0" },
    }) as never,
  )) as RouteResult;
  assert.equal(byTag.status, 404);
});

test("notification routes list and mark notifications read", async () => {
  const context = createSeededContext();

  const listed = (await getNotifications(
    create$({ context }) as never,
  )) as RouteResult;
  assert.equal(listed.status, 200);
  assert.equal((listed.body as Array<unknown>).length, 3);

  const markAll = (await putNotifications(
    create$({ context, body: { read: true } }) as never,
  )) as RouteResult;
  assert.equal(markAll.status, 202);

  const unreadAfterMarkAll = (await getNotifications(
    create$({ context }) as never,
  )) as RouteResult;
  assert.equal((unreadAfterMarkAll.body as Array<unknown>).length, 0);
});

test("notification thread routes get mark-read and mark-done behavior", async () => {
  const context = createSeededContext();

  const fetched = (await getThread(
    create$({ context, path: { thread_id: 1 } }) as never,
  )) as RouteResult;
  assert.equal(fetched.status, 200);
  assert.equal((fetched.body as { id: string }).id, "1");

  const missing = (await getThread(
    create$({ context, path: { thread_id: 999 } }) as never,
  )) as RouteResult;
  assert.equal(missing.status, 404);

  const markedRead = (await patchThread(
    create$({ context, path: { thread_id: 1 } }) as never,
  )) as RouteResult;
  assert.equal(markedRead.status, 205);
  assert.equal(context.getNotification("1")?.unread, false);

  const markedDone = (await deleteThread(
    create$({ context, path: { thread_id: 1 } }) as never,
  )) as RouteResult;
  assert.equal(markedDone.status, 204);
  assert.equal(context.getNotification("1"), undefined);
});

test("notification thread subscription routes manage subscription state", async () => {
  const context = createSeededContext();

  const fetched = (await getThreadSubscription(
    create$({ context, path: { thread_id: 1 } }) as never,
  )) as RouteResult;
  assert.equal(fetched.status, 200);

  const updated = (await putThreadSubscription(
    create$({
      context,
      path: { thread_id: 1 },
      body: { ignored: true },
    }) as never,
  )) as RouteResult;
  assert.equal(updated.status, 200);
  assert.equal((updated.body as { ignored: boolean }).ignored, true);
  assert.equal((updated.body as { subscribed: boolean }).subscribed, false);

  const deleted = (await deleteThreadSubscription(
    create$({ context, path: { thread_id: 1 } }) as never,
  )) as RouteResult;
  assert.equal(deleted.status, 204);

  const afterDelete = (await getThreadSubscription(
    create$({ context, path: { thread_id: 1 } }) as never,
  )) as RouteResult;
  assert.equal(afterDelete.status, 404);
});

test("repository notification routes filter and mark only repository threads", async () => {
  const context = createSeededContext();

  context.saveRepository({
    id: 999,
    owner: "octocat",
    name: "hello-world",
  });
  context.saveNotification({
    id: "99",
    repository: context.getRepository("octocat", "hello-world")!,
    subject: {
      title: "Issue opened",
      url: "https://api.github.com/repos/octocat/hello-world/issues/1",
      latest_comment_url:
        "https://api.github.com/repos/octocat/hello-world/issues/comments/1",
      type: "Issue",
    },
  });

  const repoListed = (await getRepoNotifications(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
    }) as never,
  )) as RouteResult;
  assert.equal(repoListed.status, 200);
  assert.equal((repoListed.body as Array<unknown>).length, 3);

  const repoMarked = (await putRepoNotifications(
    create$({
      context,
      path: { owner: "counterfact", repo: "platform-api" },
      body: {},
    }) as never,
  )) as RouteResult;
  assert.equal(repoMarked.status, 202);

  assert.equal(context.getNotification("2")?.unread, false);
  assert.equal(context.getNotification("3")?.unread, false);
  assert.equal(context.getNotification("99")?.unread, true);
});

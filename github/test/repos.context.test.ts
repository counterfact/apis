import assert from "node:assert/strict";
import test from "node:test";
import type { Context$ } from "../types/_.context.ts";
import { Context as ReposContext } from "../routes/repos/_.context.ts";

const createContext = () => {
  let nextUserId = 1;
  let nextOrganizationId = 1;
  const usersByLogin = new Map<string, { id: number; login: string }>();
  const organizationsByLogin = new Map<string, { id: number; login: string }>();
  const usersContext = {
    saveUser(user: { id?: number; login: string }) {
      const savedUser = {
        id: user.id ?? nextUserId++,
        login: user.login,
      };
      usersByLogin.set(savedUser.login, savedUser);
      return savedUser;
    },
    getUser(login: string) {
      return usersByLogin.get(login);
    },
    saveOrganization(organization: { id?: number; login: string }) {
      const savedOrganization = {
        id: organization.id ?? nextOrganizationId++,
        login: organization.login,
      };
      organizationsByLogin.set(savedOrganization.login, savedOrganization);
      return savedOrganization;
    },
    getOrganization(login: string) {
      return organizationsByLogin.get(login);
    },
  };

  const loadContext: Context$["loadContext"] = ((path: string) => {
    if (path === "/users") {
      return usersContext;
    }

    throw new Error(`Unknown context path: ${path}`);
  }) as Context$["loadContext"];

  return new ReposContext({ loadContext, readJson: async () => ({}) });
};

test("Context stores repositories, issues, pull requests, and workflows with stable lookup", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat", name: "Octocat" });
  context.saveOrganization({
    id: 10,
    login: "counterfact",
    name: "Counterfact",
  });
  context.saveRepository({
    id: 101,
    owner: "counterfact",
    name: "platform-api",
    readme: "# Platform API\n",
    branches: ["main", "feature-routing"],
  });
  context.saveIssue("counterfact", "platform-api", {
    number: 1,
    title: "Support repository fixtures",
    user: context.getUser("octocat"),
  });
  context.saveIssueComment("counterfact", "platform-api", 1, {
    body: "Need one more assertion.",
    user: context.getUser("octocat"),
  });
  context.savePullRequest("counterfact", "platform-api", {
    number: 1,
    title: "Add stateful routes",
    head: "octocat:feature-routing",
    base: "main",
    user: context.getUser("octocat"),
  });
  context.savePullRequestReview("counterfact", "platform-api", 1, {
    body: "Looks good.",
    user: context.getUser("octocat"),
  });
  context.saveWorkflow("counterfact", "platform-api", {
    id: 301,
    name: "CI",
    path: ".github/workflows/ci.yml",
  });
  context.saveWorkflowRun("counterfact", "platform-api", {
    id: 401,
    workflow_id: 301,
    head_branch: "main",
    event: "push",
    status: "completed",
    conclusion: "success",
    display_title: "CI on main",
    actor: context.getUser("octocat"),
  });
  context.saveWorkflowJob("counterfact", "platform-api", 401, {
    id: 501,
    name: "test",
    status: "completed",
    conclusion: "success",
  });

  assert.equal(context.getOrganization("counterfact")?.login, "counterfact");
  assert.equal(context.getRepository("counterfact", "platform-api")?.id, 101);
  assert.equal(
    context.getRepositoryReadme("counterfact", "platform-api")?.name,
    "README.md",
  );
  assert.equal(
    context.getRepositoryBranch(
      "counterfact",
      "platform-api",
      "feature-routing",
    )?.name,
    "feature-routing",
  );
  assert.equal(context.getIssue("counterfact", "platform-api", 1)?.comments, 1);
  assert.equal(
    context.listIssueComments("counterfact", "platform-api", 1).length,
    1,
  );
  assert.equal(
    context.getPullRequest("counterfact", "platform-api", 1)?.title,
    "Add stateful routes",
  );
  assert.equal(
    context.listPullRequestReviews("counterfact", "platform-api", 1).length,
    1,
  );
  assert.equal(context.listWorkflows("counterfact", "platform-api").length, 1);
  assert.equal(
    context.listWorkflowRuns("counterfact", "platform-api").length,
    1,
  );
  assert.equal(
    context.listWorkflowJobs("counterfact", "platform-api", 401).length,
    1,
  );
});

test("Context.savePullRequest correctly parses owner:branch format for head and base", () => {
  const context = createContext();

  // Setup users and repository
  context.saveUser({ id: 1, login: "octocat", name: "Octocat" });
  context.saveUser({ id: 2, login: "mona", name: "Mona" });
  context.saveOrganization({
    id: 10,
    login: "counterfact",
    name: "Counterfact",
  });
  context.saveRepository({
    id: 101,
    owner: "counterfact",
    name: "platform-api",
    default_branch: "main",
  });

  // Create a pull request with "owner:branch" format for head
  const pr = context.savePullRequest("counterfact", "platform-api", {
    number: 1,
    title: "Test PR",
    head: "mona:feature-routing",
    base: "main",
  });

  // Verify head is parsed correctly
  assert.equal(
    pr.head.ref,
    "feature-routing",
    "head.ref should be just the branch name",
  );
  assert.equal(
    pr.head.label,
    "mona:feature-routing",
    "head.label should be owner:branch",
  );
  assert.equal(
    pr.head.user.login,
    "mona",
    "head.user should be parsed from owner:branch",
  );

  // Verify base is set correctly
  assert.equal(pr.base.ref, "main", "base.ref should be the branch name");
  assert.ok(
    pr.base.label.includes("main"),
    "base.label should include the branch name",
  );
});

test("Context label methods manage repository labels and issue associations", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat", name: "Octocat" });
  context.saveOrganization({
    id: 10,
    login: "counterfact",
    name: "Counterfact",
  });
  context.saveRepository({
    id: 101,
    owner: "counterfact",
    name: "platform-api",
  });

  const saved = context.saveLabel("counterfact", "platform-api", {
    name: "bug",
    color: "d73a4a",
    description: "Something isn't working",
  });
  assert.equal(saved.name, "bug");
  assert.match(saved.node_id, /^LA_/);
  assert.equal(saved.default, false);
  assert.match(saved.url, /\/repos\/counterfact\/platform-api\/labels\/bug$/);
  assert.equal(context.listLabels("counterfact", "platform-api").length, 1);

  context.saveIssue("counterfact", "platform-api", {
    number: 1,
    title: "Support labels",
    labels: [{ name: "bug", color: "d73a4a" }],
  });
  assert.equal(
    (context.getIssue("counterfact", "platform-api", 1)?.labels[0] as { id: number })
      .id,
    saved.id,
  );

  const renamed = context.updateLabel("counterfact", "platform-api", "bug", {
    name: "type: bug",
  });
  assert.equal(renamed?.name, "type: bug");
  assert.equal(context.getLabel("counterfact", "platform-api", "bug"), undefined);
  assert.equal(
    (context.getIssue("counterfact", "platform-api", 1)?.labels[0] as { name: string })
      .name,
    "type: bug",
  );

  assert.equal(
    context.deleteLabel("counterfact", "platform-api", "missing"),
    false,
  );
});

test("Context label methods add, remove, and replace issue labels", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat", name: "Octocat" });
  context.saveOrganization({
    id: 10,
    login: "counterfact",
    name: "Counterfact",
  });
  context.saveRepository({
    id: 101,
    owner: "counterfact",
    name: "platform-api",
  });
  context.saveIssue("counterfact", "platform-api", {
    number: 1,
    title: "Support labels",
  });
  context.saveLabel("counterfact", "platform-api", {
    name: "bug",
    color: "d73a4a",
  });
  context.saveLabel("counterfact", "platform-api", {
    name: "enhancement",
    color: "84b6eb",
  });
  context.saveLabel("counterfact", "platform-api", {
    name: "question",
    color: "d876e3",
  });

  const added = context.addLabelToIssue("counterfact", "platform-api", 1, [
    "bug",
    "enhancement",
  ]);
  assert.deepEqual(
    added.map((item) => item.name),
    ["bug", "enhancement"],
  );

  assert.equal(
    context.removeLabelFromIssue("counterfact", "platform-api", 1, "bug"),
    true,
  );
  assert.deepEqual(
    context.listIssueLabels("counterfact", "platform-api", 1).map((item) => item.name),
    ["enhancement"],
  );

  const replaced = context.replaceIssueLabels("counterfact", "platform-api", 1, [
    "question",
  ]);
  assert.deepEqual(
    replaced.map((item) => item.name),
    ["question"],
  );
});

test("Context commit methods resolve refs, paginate, and manage statuses/comments", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat", name: "Octocat" });
  context.saveRepository({
    id: 101,
    owner: "octocat",
    name: "hello-world",
    default_branch: "main",
    branches: ["main", "dev", "feature"],
  });

  const mainCommit = context.getRepositoryBranch(
    "octocat",
    "hello-world",
    "main",
  )?.commit;
  const devCommit = context.getRepositoryBranch(
    "octocat",
    "hello-world",
    "dev",
  )?.commit;
  assert.ok(mainCommit);
  assert.ok(devCommit);

  const bySha = context.getCommit("octocat", "hello-world", mainCommit!.sha);
  assert.equal(bySha?.sha, mainCommit!.sha);

  const defaultBranchCommits = context.listCommits("octocat", "hello-world");
  assert.equal(defaultBranchCommits.length, 1);
  assert.equal(defaultBranchCommits[0].sha, mainCommit!.sha);

  const filtered = context.listCommits("octocat", "hello-world", {
    sha: "dev",
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].sha, devCommit!.sha);

  const lintStatus = context.saveCommitStatus(
    "octocat",
    "hello-world",
    mainCommit!.sha,
    {
      state: "success",
      context: "ci/lint",
    },
  );
  const testFailedStatus = context.saveCommitStatus(
    "octocat",
    "hello-world",
    mainCommit!.sha,
    {
      state: "failure",
      context: "ci/test",
    },
  );
  const testRecoveredStatus = context.saveCommitStatus(
    "octocat",
    "hello-world",
    mainCommit!.sha,
    {
      state: "success",
      context: "ci/test",
    },
  );
  const sameTimestamp = "2024-01-01T00:00:00.000Z";
  lintStatus.created_at = sameTimestamp;
  testFailedStatus.created_at = sameTimestamp;
  testRecoveredStatus.created_at = sameTimestamp;

  const statuses = context.listCommitStatuses(
    "octocat",
    "hello-world",
    mainCommit!.sha,
  );
  assert.equal(statuses.length, 3);
  assert.equal(statuses[0].id, testRecoveredStatus.id);

  const statusPage1 = context.listCommitStatuses(
    "octocat",
    "hello-world",
    mainCommit!.sha,
    {
      per_page: 2,
      page: 1,
    },
  );
  const statusPage2 = context.listCommitStatuses(
    "octocat",
    "hello-world",
    mainCommit!.sha,
    {
      per_page: 2,
      page: 2,
    },
  );
  assert.equal(statusPage1.length, 2);
  assert.equal(statusPage2.length, 1);
  assert.equal(statusPage1[0].id, testRecoveredStatus.id);

  assert.equal(
    context.getCombinedStatus("octocat", "hello-world", "main")?.state,
    "success",
  );

  context.saveCommitStatus("octocat", "hello-world", mainCommit!.sha, {
    state: "success",
    context: "deploy/prod",
  });
  assert.equal(
    context.getCombinedStatus("octocat", "hello-world", "main")?.state,
    "success",
  );

  const comment1 = context.saveCommitComment("octocat", "hello-world", "main", {
    body: "Looks good",
    path: "README.md",
    line: 1,
  });
  const comment2 = context.saveCommitComment("octocat", "hello-world", "main", {
    body: "Please add tests",
  });
  const comment3 = context.saveCommitComment("octocat", "hello-world", "main", {
    body: "Merged",
  });
  assert.ok(comment1.id > 0);
  assert.ok(comment1.created_at);
  assert.ok(comment1.updated_at);
  assert.ok(comment2.id > comment1.id);
  assert.ok(comment3.id > comment2.id);
  assert.equal(
    context.listCommitComments("octocat", "hello-world", mainCommit!.sha)
      .length,
    3,
  );

  const commentPage1 = context.listCommitComments(
    "octocat",
    "hello-world",
    mainCommit!.sha,
    {
      per_page: 2,
      page: 1,
    },
  );
  const commentPage2 = context.listCommitComments(
    "octocat",
    "hello-world",
    mainCommit!.sha,
    {
      per_page: 2,
      page: 2,
    },
  );
  assert.equal(commentPage1.length, 2);
  assert.equal(commentPage2.length, 1);
  assert.equal(commentPage1[0].id, comment1.id);
  assert.equal(commentPage2[0].id, comment3.id);
});

test("Context.saveRelease creates a release with auto-generated fields and correct author", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat", name: "Octocat" });
  context.saveRepository({ id: 101, owner: "octocat", name: "hello-world" });

  const release = context.saveRelease("octocat", "hello-world", {
    tag_name: "v1.0.0",
    name: "Version 1.0.0",
    body: "Initial release",
  });

  assert.ok(release.id > 0, "release should have a positive id");
  assert.ok(release.node_id, "release should have a node_id");
  assert.ok(release.url.includes(String(release.id)), "url should contain id");
  assert.ok(
    release.html_url.includes("v1.0.0"),
    "html_url should contain tag name",
  );
  assert.ok(release.assets_url, "assets_url should be set");
  assert.ok(release.upload_url, "upload_url should be set");
  assert.ok(
    release.tarball_url.includes("v1.0.0"),
    "tarball_url should include tag",
  );
  assert.ok(
    release.zipball_url.includes("v1.0.0"),
    "zipball_url should include tag",
  );
  assert.equal(release.tag_name, "v1.0.0");
  assert.equal(release.name, "Version 1.0.0");
  assert.equal(release.body, "Initial release");
  assert.equal(release.draft, false);
  assert.equal(release.prerelease, false);
  assert.ok(release.created_at);
  assert.ok(release.published_at);
  assert.equal(release.author.login, "octocat");
  assert.deepEqual(release.assets, []);
});

test("Context.listReleases respects pagination", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat" });
  context.saveRepository({ id: 101, owner: "octocat", name: "hello-world" });

  for (let index = 1; index <= 5; index++) {
    context.saveRelease("octocat", "hello-world", {
      tag_name: `v${index}.0.0`,
    });
  }

  const page1 = context.listReleases("octocat", "hello-world", {
    per_page: 2,
    page: 1,
  });
  assert.equal(page1.length, 2);

  const page2 = context.listReleases("octocat", "hello-world", {
    per_page: 2,
    page: 2,
  });
  assert.equal(page2.length, 2);

  const page3 = context.listReleases("octocat", "hello-world", {
    per_page: 2,
    page: 3,
  });
  assert.equal(page3.length, 1);

  const allTags = new Set(
    [...page1, ...page2, ...page3].map((r) => r.tag_name),
  );
  assert.equal(allTags.size, 5, "all 5 releases should appear across pages");
});

test("Context.getLatestRelease skips draft and pre-release entries and uses created_at ordering", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat" });
  context.saveRepository({ id: 101, owner: "octocat", name: "hello-world" });

  context.saveRelease("octocat", "hello-world", {
    id: 1,
    tag_name: "v1.0.0",
    draft: false,
    prerelease: false,
    created_at: "2024-01-01T00:00:00Z",
    published_at: "2024-04-01T00:00:00Z",
  });
  context.saveRelease("octocat", "hello-world", {
    id: 2,
    tag_name: "v1.1.0",
    draft: false,
    prerelease: false,
    created_at: "2024-02-01T00:00:00Z",
    published_at: "2024-03-01T00:00:00Z",
  });
  context.saveRelease("octocat", "hello-world", {
    id: 3,
    tag_name: "v2.0.0-beta",
    draft: false,
    prerelease: true,
    created_at: "2024-03-01T00:00:00Z",
    published_at: "2024-05-01T00:00:00Z",
  });
  context.saveRelease("octocat", "hello-world", {
    id: 4,
    tag_name: "v2.0.0-draft",
    draft: true,
    prerelease: false,
    created_at: "2024-04-01T00:00:00Z",
    published_at: "2024-06-01T00:00:00Z",
  });

  const latest = context.getLatestRelease("octocat", "hello-world");
  assert.equal(
    latest?.tag_name,
    "v1.1.0",
    "latest should be the newest stable release by created_at",
  );
});

test("Context.getReleaseByTag returns the matching release or undefined", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat" });
  context.saveRepository({ id: 101, owner: "octocat", name: "hello-world" });

  context.saveRelease("octocat", "hello-world", { tag_name: "v1.0.0" });

  const found = context.getReleaseByTag("octocat", "hello-world", "v1.0.0");
  assert.ok(found, "should find release by tag");
  assert.equal(found?.tag_name, "v1.0.0");

  const notFound = context.getReleaseByTag("octocat", "hello-world", "v99.0.0");
  assert.equal(notFound, undefined);
});

test("Context.updateRelease merges patch fields and returns the updated release", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat" });
  context.saveRepository({ id: 101, owner: "octocat", name: "hello-world" });

  const original = context.saveRelease("octocat", "hello-world", {
    id: 10,
    tag_name: "v1.0.0",
    name: "Version 1.0.0",
    body: "Initial body",
    draft: true,
  });

  const updated = context.updateRelease("octocat", "hello-world", original.id, {
    name: "Updated name",
    body: "Updated body",
    draft: false,
  });

  assert.ok(updated, "update should return the updated release");
  assert.equal(updated?.id, original.id, "id should be preserved");
  assert.equal(updated?.tag_name, "v1.0.0", "tag_name should be preserved");
  assert.equal(updated?.name, "Updated name");
  assert.equal(updated?.body, "Updated body");
  assert.equal(updated?.draft, false);
});

test("Context.deleteRelease removes the release and returns false when not found", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat" });
  context.saveRepository({ id: 101, owner: "octocat", name: "hello-world" });

  const release = context.saveRelease("octocat", "hello-world", {
    id: 10,
    tag_name: "v1.0.0",
  });

  assert.equal(
    context.getRelease("octocat", "hello-world", release.id) !== undefined,
    true,
  );
  assert.equal(
    context.deleteRelease("octocat", "hello-world", release.id),
    true,
  );
  assert.equal(
    context.getRelease("octocat", "hello-world", release.id),
    undefined,
  );
  assert.equal(
    context.deleteRelease("octocat", "hello-world", release.id),
    false,
  );
});

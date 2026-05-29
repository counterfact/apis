import assert from "node:assert/strict";
import test from "node:test";
import { createContext } from "../test-support/create-context.ts";

test("Context.saveGist assigns an id and sets URL fields", () => {
  const context = createContext();

  const gist = context.saveGist({
    description: "Hello World",
    public: true,
    files: {
      "hello.txt": { filename: "hello.txt", content: "Hello!" },
    },
  });

  assert.ok(gist.id, "gist should have an id");
  assert.equal(gist.description, "Hello World");
  assert.equal(gist.public, true);
  assert.ok(gist.url?.includes(gist.id!), "url should contain the gist id");
  assert.ok(
    gist.html_url?.startsWith("https://gist.github.com/"),
    "html_url should point at gist.github.com",
  );
  assert.ok(gist.html_url?.includes(gist.id!));
  assert.ok(
    gist.git_pull_url?.startsWith("https://gist.github.com/"),
    "git_pull_url should point at gist.github.com",
  );
  assert.ok(
    gist.git_push_url?.startsWith("https://gist.github.com/"),
    "git_push_url should point at gist.github.com",
  );
  assert.ok(gist.created_at);
  assert.ok(gist.updated_at);
});

test("Context.saveGist preserves an explicit id", () => {
  const context = createContext();

  const gist = context.saveGist({
    id: "abc123",
    description: "My Gist",
    public: false,
    files: {
      "file.js": { filename: "file.js", content: "console.log(1)" },
    },
  });

  assert.equal(gist.id, "abc123");
  assert.equal(gist.public, false);
});

test("Context.saveGist auto-increments ids for subsequent gists", () => {
  const context = createContext();

  const first = context.saveGist({
    files: { "a.txt": { filename: "a.txt", content: "a" } },
  });
  const second = context.saveGist({
    files: { "b.txt": { filename: "b.txt", content: "b" } },
  });

  assert.notEqual(first.id, second.id);
});

test("Context.getGist and hasGist work correctly", () => {
  const context = createContext();

  assert.equal(context.hasGist("missing"), false);
  assert.equal(context.getGist("missing"), undefined);

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  assert.equal(context.hasGist(gist.id!), true);
  assert.equal(context.getGist(gist.id!)?.id, gist.id);
});

test("Context.deleteGist removes the gist", () => {
  const context = createContext();

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  assert.equal(context.hasGist(gist.id!), true);
  assert.equal(context.deleteGist(gist.id!), true);
  assert.equal(context.hasGist(gist.id!), false);
  assert.equal(context.deleteGist(gist.id!), false);
});

test("Context.listGists returns all gists", () => {
  const context = createContext();

  context.saveGist({
    files: { "a.txt": { filename: "a.txt", content: "a" } },
  });
  context.saveGist({
    files: { "b.txt": { filename: "b.txt", content: "b" } },
  });

  assert.equal(context.listGists().length, 2);
});

test("Context.listPublicGists returns only public gists", () => {
  const context = createContext();

  context.saveGist({
    public: true,
    files: { "pub.txt": { filename: "pub.txt", content: "pub" } },
  });
  context.saveGist({
    public: false,
    files: { "priv.txt": { filename: "priv.txt", content: "priv" } },
  });

  const publicGists = context.listPublicGists();
  assert.equal(publicGists.length, 1);
  assert.equal(publicGists[0].public, true);
});

test("Context star/unstar/isGistStarred work correctly", () => {
  const context = createContext();

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  assert.equal(context.isGistStarred(gist.id!), false);
  context.starGist(gist.id!);
  assert.equal(context.isGistStarred(gist.id!), true);
  context.unstarGist(gist.id!);
  assert.equal(context.isGistStarred(gist.id!), false);
});

test("Context.listStarredGists returns only starred gists", () => {
  const context = createContext();

  const g1 = context.saveGist({
    files: { "a.txt": { filename: "a.txt", content: "a" } },
  });
  const g2 = context.saveGist({
    files: { "b.txt": { filename: "b.txt", content: "b" } },
  });

  context.starGist(g1.id!);

  const starred = context.listStarredGists();
  assert.equal(starred.length, 1);
  assert.equal(starred[0].id, g1.id);
  assert.ok(!starred.some((g) => g.id === g2.id));
});

test("Context.saveComment creates a comment and updates gist comment count", () => {
  const context = createContext();

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  const comment = context.saveComment(gist.id!, { body: "Great gist!" });
  assert.ok(comment.id > 0);
  assert.equal(comment.body, "Great gist!");
  assert.ok(comment.url?.includes(String(comment.id)));
  assert.equal(context.getGist(gist.id!)?.comments, 1);
});

test("Context.saveComment preserves explicit comment id", () => {
  const context = createContext();

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  const comment = context.saveComment(gist.id!, { id: 42, body: "A comment" });
  assert.equal(comment.id, 42);
  assert.equal(context.getComment(gist.id!, 42)?.body, "A comment");
});

test("Context.saveComment (update) preserves created_at and updates body", () => {
  const context = createContext();

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  const original = context.saveComment(gist.id!, { body: "Original" });
  const updated = context.saveComment(gist.id!, {
    id: original.id,
    body: "Updated",
  });

  assert.equal(updated.body, "Updated");
  assert.equal(updated.created_at, original.created_at);
  assert.equal(context.listComments(gist.id!).length, 1);
});

test("Context.deleteComment removes a comment and updates gist count", () => {
  const context = createContext();

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  const comment = context.saveComment(gist.id!, { body: "A comment" });
  assert.equal(context.hasComment(gist.id!, comment.id), true);
  assert.equal(context.deleteComment(gist.id!, comment.id), true);
  assert.equal(context.hasComment(gist.id!, comment.id), false);
  assert.equal(context.getGist(gist.id!)?.comments, 0);
  assert.equal(context.deleteComment(gist.id!, comment.id), false);
});

test("Context.listComments returns all comments for a gist", () => {
  const context = createContext();

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  context.saveComment(gist.id!, { body: "First" });
  context.saveComment(gist.id!, { body: "Second" });

  const comments = context.listComments(gist.id!);
  assert.equal(comments.length, 2);
  assert.ok(comments.some((c) => c.body === "First"));
  assert.ok(comments.some((c) => c.body === "Second"));
});

test("Context.listComments returns empty array for unknown gist", () => {
  const context = createContext();
  assert.deepEqual(context.listComments("nonexistent"), []);
});

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

test("Context.getLatestRelease skips draft and pre-release entries", () => {
  const context = createContext();

  context.saveUser({ id: 1, login: "octocat" });
  context.saveRepository({ id: 101, owner: "octocat", name: "hello-world" });

  context.saveRelease("octocat", "hello-world", {
    id: 1,
    tag_name: "v1.0.0",
    draft: false,
    prerelease: false,
    published_at: "2024-01-01T00:00:00Z",
  });
  context.saveRelease("octocat", "hello-world", {
    id: 2,
    tag_name: "v2.0.0-beta",
    draft: false,
    prerelease: true,
    published_at: "2024-02-01T00:00:00Z",
  });
  context.saveRelease("octocat", "hello-world", {
    id: 3,
    tag_name: "v2.0.0-draft",
    draft: true,
    prerelease: false,
    published_at: "2024-03-01T00:00:00Z",
  });

  const latest = context.getLatestRelease("octocat", "hello-world");
  assert.equal(
    latest?.tag_name,
    "v1.0.0",
    "latest should be the stable release",
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

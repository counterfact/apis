import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../routes/_.context.ts";

test("Context.saveGist assigns an id and sets URL fields", () => {
  const context = new Context({} as never);

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
  assert.ok(gist.html_url?.includes(gist.id!));
  assert.ok(gist.created_at);
  assert.ok(gist.updated_at);
});

test("Context.saveGist preserves an explicit id", () => {
  const context = new Context({} as never);

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
  const context = new Context({} as never);

  const first = context.saveGist({
    files: { "a.txt": { filename: "a.txt", content: "a" } },
  });
  const second = context.saveGist({
    files: { "b.txt": { filename: "b.txt", content: "b" } },
  });

  assert.notEqual(first.id, second.id);
});

test("Context.getGist and hasGist work correctly", () => {
  const context = new Context({} as never);

  assert.equal(context.hasGist("missing"), false);
  assert.equal(context.getGist("missing"), undefined);

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  assert.equal(context.hasGist(gist.id!), true);
  assert.equal(context.getGist(gist.id!)?.id, gist.id);
});

test("Context.deleteGist removes the gist", () => {
  const context = new Context({} as never);

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  assert.equal(context.hasGist(gist.id!), true);
  assert.equal(context.deleteGist(gist.id!), true);
  assert.equal(context.hasGist(gist.id!), false);
  assert.equal(context.deleteGist(gist.id!), false);
});

test("Context.listGists returns all gists", () => {
  const context = new Context({} as never);

  context.saveGist({
    files: { "a.txt": { filename: "a.txt", content: "a" } },
  });
  context.saveGist({
    files: { "b.txt": { filename: "b.txt", content: "b" } },
  });

  assert.equal(context.listGists().length, 2);
});

test("Context.listPublicGists returns only public gists", () => {
  const context = new Context({} as never);

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
  const context = new Context({} as never);

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
  const context = new Context({} as never);

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
  const context = new Context({} as never);

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
  const context = new Context({} as never);

  const gist = context.saveGist({
    files: { "x.txt": { filename: "x.txt", content: "x" } },
  });

  const comment = context.saveComment(gist.id!, { id: 42, body: "A comment" });
  assert.equal(comment.id, 42);
  assert.equal(context.getComment(gist.id!, 42)?.body, "A comment");
});

test("Context.saveComment (update) preserves created_at and updates body", () => {
  const context = new Context({} as never);

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
  const context = new Context({} as never);

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
  const context = new Context({} as never);

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
  const context = new Context({} as never);
  assert.deepEqual(context.listComments("nonexistent"), []);
});

test("Context stores repositories, issues, pull requests, and workflows with stable lookup", () => {
  const context = new Context({} as never);

  context.saveUser({ id: 1, login: "octocat", name: "Octocat" });
  context.saveOrganization({ id: 10, login: "counterfact", name: "Counterfact" });
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
  assert.equal(context.getRepositoryReadme("counterfact", "platform-api")?.name, "README.md");
  assert.equal(
    context.getRepositoryBranch("counterfact", "platform-api", "feature-routing")?.name,
    "feature-routing",
  );
  assert.equal(context.getIssue("counterfact", "platform-api", 1)?.comments, 1);
  assert.equal(context.listIssueComments("counterfact", "platform-api", 1).length, 1);
  assert.equal(context.getPullRequest("counterfact", "platform-api", 1)?.title, "Add stateful routes");
  assert.equal(context.listPullRequestReviews("counterfact", "platform-api", 1).length, 1);
  assert.equal(context.listWorkflows("counterfact", "platform-api").length, 1);
  assert.equal(context.listWorkflowRuns("counterfact", "platform-api").length, 1);
  assert.equal(context.listWorkflowJobs("counterfact", "platform-api", 401).length, 1);
});

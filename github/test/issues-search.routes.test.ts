import assert from "node:assert/strict";
import test from "node:test";
import { startCounterfactServer } from "../test-support/counterfact-server.ts";
import type { issue } from "../types/components/schemas/issue.ts";

type SearchEnvelope = {
  total_count: number;
  incomplete_results: boolean;
  items: unknown[];
};

test("global issues and remaining searches project seeded state over HTTP", async () => {
  const server = await startCounterfactServer();

  try {
    const defaultIssuesResponse = await server.fetch("/issues");
    assert.equal(defaultIssuesResponse.status, 200);
    assert.deepEqual(await defaultIssuesResponse.json(), []);

    const issuesResponse = await server.fetch("/issues?filter=all&state=all");
    assert.equal(issuesResponse.status, 200);
    assert.equal(((await issuesResponse.json()) as issue[]).length, 2);

    const closedResponse = await server.fetch(
      "/issues?filter=all&state=closed",
    );
    assert.equal(closedResponse.status, 200);
    assert.deepEqual(
      ((await closedResponse.json()) as issue[]).map(({ number }) => number),
      [2],
    );

    const userResponse = await server.fetch("/search/users?q=octocat");
    assert.equal(userResponse.status, 200);
    assert.equal(
      ((await userResponse.json()) as SearchEnvelope).total_count,
      1,
    );

    const commitResponse = await server.fetch("/search/commits?q=latest");
    assert.equal(commitResponse.status, 200);
    assert.ok(
      ((await commitResponse.json()) as SearchEnvelope).total_count >= 1,
    );

    const labelResponse = await server.fetch(
      "/search/labels?repository_id=102&q=enhancement",
    );
    assert.equal(labelResponse.status, 200);
    assert.equal(
      ((await labelResponse.json()) as SearchEnvelope).total_count,
      1,
    );

    for (const endpoint of ["topics", "code"]) {
      const response = await server.fetch(`/search/${endpoint}?q=api`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), {
        total_count: 0,
        incomplete_results: false,
        items: [],
      });
    }
  } finally {
    await server.stop();
  }
});

test("search routes preserve visibility and forward generated sort and qualifier queries", async () => {
  const server = await startCounterfactServer();

  try {
    server.context.saveRepository({
      id: 901,
      owner: "outsider",
      name: "private-search-data",
      private: true,
    });
    const privateCommit = server.context.getCommit(
      "outsider",
      "private-search-data",
      "main",
    )!;
    privateCommit.commit.message = "private route needle";
    server.context.saveLabel("outsider", "private-search-data", {
      name: "private-route-label",
      color: "000000",
    });

    const hiddenCommit = await server.fetch(
      "/search/commits?q=private%20route%20needle",
    );
    assert.equal(hiddenCommit.status, 200);
    assert.equal(
      ((await hiddenCommit.json()) as SearchEnvelope).total_count,
      0,
    );
    const hiddenLabel = await server.fetch(
      "/search/labels?repository_id=901&q=private-route",
    );
    assert.equal(hiddenLabel.status, 200);
    assert.equal(((await hiddenLabel.json()) as SearchEnvelope).total_count, 0);

    server.context.saveRepository({
      id: 902,
      owner: "octocat",
      name: "http-author-first",
    });
    server.context.saveRepository({
      id: 903,
      owner: "octocat",
      name: "http-committer-first",
    });
    const authorFirst = server.context.getCommit(
      "octocat",
      "http-author-first",
      "main",
    )!;
    const committerFirst = server.context.getCommit(
      "octocat",
      "http-committer-first",
      "main",
    )!;
    authorFirst.commit.message = "http timestamp ordering";
    authorFirst.commit.author!.date = "2024-01-01T00:00:00Z";
    authorFirst.commit.committer!.date = "2024-02-01T00:00:00Z";
    committerFirst.commit.message = "http timestamp ordering";
    committerFirst.commit.author!.date = "2024-02-01T00:00:00Z";
    committerFirst.commit.committer!.date = "2024-01-01T00:00:00Z";

    const authorOrder = (await (
      await server.fetch(
        "/search/commits?q=http%20timestamp%20ordering&sort=author-date&order=asc",
      )
    ).json()) as SearchEnvelope & {
      items: Array<{ repository: { name: string } }>;
    };
    assert.deepEqual(
      authorOrder.items.map(({ repository }) => repository.name),
      ["http-author-first", "http-committer-first"],
    );
    const committerOrder = (await (
      await server.fetch(
        "/search/commits?q=http%20timestamp%20ordering&sort=committer-date&order=asc",
      )
    ).json()) as SearchEnvelope & {
      items: Array<{ repository: { name: string } }>;
    };
    assert.deepEqual(
      committerOrder.items.map(({ repository }) => repository.name),
      ["http-committer-first", "http-author-first"],
    );

    server.context.saveLabel("counterfact", "platform-api", {
      name: "http-label-first",
      color: "111111",
    });
    server.context.saveLabel("counterfact", "platform-api", {
      name: "http-label-second",
      color: "222222",
    });
    server.context.updateLabel(
      "counterfact",
      "platform-api",
      "http-label-first",
      {
        description: "updated after creation",
      },
    );
    const createdLabels = (await (
      await server.fetch(
        "/search/labels?repository_id=102&q=http-label&sort=created&order=asc&per_page=1&page=1",
      )
    ).json()) as SearchEnvelope & { items: Array<{ name: string }> };
    assert.deepEqual(
      createdLabels.items.map(({ name }) => name),
      ["http-label-first"],
    );
    const updatedLabels = (await (
      await server.fetch(
        "/search/labels?repository_id=102&q=http-label&sort=updated&order=asc",
      )
    ).json()) as SearchEnvelope & { items: Array<{ name: string }> };
    assert.deepEqual(
      updatedLabels.items.map(({ name }) => name),
      ["http-label-second", "http-label-first"],
    );

    const loginMatch = await server.fetch(
      "/search/users?q=login%3Aoctocat&sort=followers&order=asc",
    );
    assert.equal(loginMatch.status, 200);
    assert.equal(((await loginMatch.json()) as SearchEnvelope).total_count, 1);
    const loginMiss = await server.fetch(
      "/search/users?q=login%3Adoes-not-exist&sort=joined&order=desc",
    );
    assert.equal(loginMiss.status, 200);
    assert.equal(((await loginMiss.json()) as SearchEnvelope).total_count, 0);
  } finally {
    await server.stop();
  }
});

test("authenticated issues honor the requested participation filter", async () => {
  const server = await startCounterfactServer();

  try {
    server.context.saveIssue("octocat", "hello-world", {
      number: 99,
      title: "Visible but not assigned to the authenticated user",
    });

    const assigned = await server.fetch(
      "/user/issues?filter=assigned&state=all",
    );
    assert.equal(assigned.status, 200);
    assert.equal(
      ((await assigned.json()) as issue[]).some(
        ({ title }) =>
          title === "Visible but not assigned to the authenticated user",
      ),
      false,
    );

    for (const filter of ["all", "repos"]) {
      const response = await server.fetch(
        `/user/issues?filter=${filter}&state=all`,
      );
      assert.equal(response.status, 200);
      assert.equal(
        ((await response.json()) as issue[]).some(
          ({ title }) =>
            title === "Visible but not assigned to the authenticated user",
        ),
        true,
      );
    }
  } finally {
    await server.stop();
  }
});

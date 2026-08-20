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

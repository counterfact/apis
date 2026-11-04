import assert from "node:assert/strict";
import test from "node:test";
import { startCounterfactServer } from "../test-support/counterfact-server.ts";

test("serves startup-seeded state over HTTP", async () => {
  const server = await startCounterfactServer();

  try {
    const response = await server.fetch("/emojis");
    assert.equal(response.status, 200);
    assert.equal(
      ((await response.json()) as Record<string, string>).smile,
      "https://github.githubassets.com/images/icons/emoji/unicode/1f604.png",
    );

    const rateLimitResponse = await server.fetch("/rate_limit");
    assert.equal(rateLimitResponse.status, 200);
    const rateLimit = (await rateLimitResponse.json()) as {
      rate: { limit: number; remaining: number };
      resources: { core: { limit: number; remaining: number } };
    };
    assert.deepEqual(rateLimit.rate, rateLimit.resources.core);
    assert.ok(rateLimit.rate.limit > 0);
    assert.ok(rateLimit.rate.remaining <= rateLimit.rate.limit);
  } finally {
    await server.stop();
  }
});

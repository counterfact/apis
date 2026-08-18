import assert from "node:assert/strict";
import test from "node:test";
import { startCounterfactServer } from "../test-support/counterfact-server.ts";

test("serves startup-seeded emojis over HTTP", async () => {
  const server = await startCounterfactServer();

  try {
    const response = await server.fetch("/emojis");
    assert.equal(response.status, 200);
    assert.equal(
      ((await response.json()) as Record<string, string>).smile,
      "https://github.githubassets.com/images/icons/emoji/unicode/1f604.png",
    );
  } finally {
    await server.stop();
  }
});

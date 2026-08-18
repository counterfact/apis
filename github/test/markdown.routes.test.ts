import assert from "node:assert/strict";
import test from "node:test";
import { startCounterfactServer } from "../test-support/counterfact-server.ts";

// Counterfact 2.12's HTTP body parser does not expose text/plain request bodies
// to route handlers. Raw-mode rendering is therefore covered directly by Context.
test("POST /markdown renders HTML over Counterfact HTTP", async () => {
  const server = await startCounterfactServer();

  try {
    const rendered = await server.fetch("/markdown", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: "See #42 and `<script>`",
        mode: "gfm",
        context: "octocat/hello-world",
      }),
    });
    assert.equal(rendered.status, 200);
    assert.equal(
      rendered.headers.get("content-type"),
      "text/html; charset=utf-8",
    );
    assert.match(rendered.headers.get("content-length") ?? "", /^\d+$/);
    assert.match(
      rendered.headers.get("x-commonmarker-version") ?? "",
      /^\d+\.\d+\.\d+$/,
    );
    assert.equal(
      await rendered.text(),
      '<p>See <a href="https://github.com/octocat/hello-world/issues/42">#42</a> and <code>&lt;script&gt;</code></p>',
    );

    const invalid = await server.fetch("/markdown", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(invalid.status, 400);
  } finally {
    await server.stop();
  }
});

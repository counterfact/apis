import assert from "node:assert/strict";
import test from "node:test";
import { startCounterfactServer } from "../test-support/counterfact-server.ts";
import type { api_overview } from "../types/components/schemas/api-overview.ts";
import type { code_of_conduct } from "../types/components/schemas/code-of-conduct.ts";
import type { gitignore_template } from "../types/components/schemas/gitignore-template.ts";

test("static GitHub domains return deterministic startup fixtures", async () => {
  const server = await startCounterfactServer();

  try {
    const codesResponse = await server.fetch("/codes_of_conduct");
    assert.equal(codesResponse.status, 200);
    const codes = (await codesResponse.json()) as code_of_conduct[];
    assert.equal(codes.length, 12);
    assert.ok(codes.some(({ key }) => key === "contributor_covenant"));

    const mitResponse = await server.fetch("/codes_of_conduct/mit");
    assert.equal(mitResponse.status, 200);
    assert.equal(((await mitResponse.json()) as code_of_conduct).key, "mit");
    assert.equal((await server.fetch("/codes_of_conduct/missing")).status, 404);

    const namesResponse = await server.fetch("/gitignore/templates");
    assert.equal(namesResponse.status, 200);
    assert.deepEqual(await namesResponse.json(), [
      "Go",
      "Java",
      "Node",
      "Python",
      "Ruby",
    ]);
    const nodeResponse = await server.fetch("/gitignore/templates/Node");
    assert.equal(nodeResponse.status, 200);
    assert.match(
      ((await nodeResponse.json()) as gitignore_template).source,
      /node_modules/,
    );
    const missingTemplate = await server.fetch("/gitignore/templates/Missing");
    assert.equal(missingTemplate.status, 404);
    assert.deepEqual(await missingTemplate.json(), {
      message: "Not Found",
      status: "404",
    });

    const metaResponse = await server.fetch("/meta");
    assert.equal(metaResponse.status, 200);
    const overview = (await metaResponse.json()) as api_overview;
    assert.equal(overview.verifiable_password_authentication, true);
    assert.ok(overview.api?.includes("192.30.252.0/22"));
  } finally {
    await server.stop();
  }
});

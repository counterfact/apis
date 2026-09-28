import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";
import { Context } from "../routes/_.context.js";

const basePath = fileURLToPath(new URL("../", import.meta.url));
const openApiPath = fileURLToPath(new URL("../openapi.json", import.meta.url));
const token = "ld-simulator-token";

let port: number;
let context: Context;
let server: { stop(): Promise<void> } | undefined;

const getFreePort = async () =>
  new Promise<number>((resolve, reject) => {
    const probe = net.createServer();
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (address && typeof address === "object") resolve(address.port);
      else reject(new Error("failed to allocate a local port"));
      probe.close();
    });
    probe.on("error", reject);
  });

const request = (path: string, init: RequestInit = {}, authenticated = true) =>
  fetch(`http://127.0.0.1:${port}${path}`, {
    ...init,
    headers: {
      ...(authenticated ? { authorization: token } : {}),
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });

test.before(async () => {
  port = await getFreePort();
  const config = {
    adminApiToken: "",
    alwaysFakeOptionals: false,
    basePath,
    buildCache: false,
    generate: { prune: false, routes: false, types: false },
    openApiPath,
    port,
    prefix: "",
    proxyPaths: new Map([["", false]]),
    proxyUrl: "",
    startAdminApi: false,
    startRepl: false,
    startServer: true,
    // Semantic patch support is a current-documentation overlay on the pinned
    // 2024 contract, so handler tests intentionally bypass request validation.
    validateRequests: false,
    validateResponses: true,
    watch: { routes: false, types: false },
  };
  const app = await counterfact(config);
  server = await app.start(config);
  context = app.contextRegistry.find("/") as Context;
  context.reset();
});

test.after(async () => server?.stop());

test("enforces the local credential and supports a project-to-flag workflow", async () => {
  const unauthorized = await request("/api/v2/projects", {}, false);
  assert.equal(unauthorized.status, 401);
  assert.deepEqual(await unauthorized.json(), {
    code: "unauthorized",
    message: "Invalid simulator access token",
  });

  const project = await request("/api/v2/projects", {
    method: "POST",
    body: JSON.stringify({ key: "storefront", name: "Storefront" }),
  });
  assert.equal(project.status, 201);
  assert.equal(((await project.json()) as { key: string }).key, "storefront");

  const environment = await request(
    "/api/v2/projects/storefront/environments",
    {
      method: "POST",
      body: JSON.stringify({
        key: "preview",
        name: "Preview",
        color: "2f80ed",
      }),
    },
  );
  assert.equal(environment.status, 201);

  const flag = await request("/api/v2/flags/storefront", {
    method: "POST",
    body: JSON.stringify({
      key: "alternate-checkout",
      name: "Alternate checkout",
    }),
  });
  assert.equal(flag.status, 201);
  const created = (await flag.json()) as {
    _version: number;
    variations: Array<{ _id: string }>;
  };

  const enabled = await request("/api/v2/flags/storefront/alternate-checkout", {
    method: "PATCH",
    headers: {
      "content-type":
        "application/json; domain-model=launchdarkly.semanticpatch",
    },
    body: JSON.stringify({
      environmentKey: "preview",
      instructions: [
        { kind: "turnFlagOn" },
        { kind: "updateOffVariation", variationId: created.variations[1]!._id },
      ],
    }),
  });
  assert.equal(enabled.status, 200);
  assert.equal(
    ((await enabled.json()) as { _version: number })._version,
    created._version + 1,
  );

  const status = await request(
    "/api/v2/flag-statuses/storefront/preview/alternate-checkout",
  );
  assert.equal(status.status, 200);
  assert.equal(((await status.json()) as { name: string }).name, "active");
});

test("semantic patches are atomic and dry runs do not persist", async () => {
  context.reset();
  context.createProject({ key: "platform", name: "Platform" });
  const original = context.createFlag("platform", {
    key: "dark-mode",
    name: "Dark mode",
  });

  const rejected = await request("/api/v2/flags/platform/dark-mode", {
    method: "PATCH",
    headers: {
      "content-type":
        "application/json; domain-model=launchdarkly.semanticpatch",
    },
    body: JSON.stringify({
      environmentKey: "production",
      instructions: [
        { kind: "turnFlagOn" },
        { kind: "notImplementedByTheSimulator" },
      ],
    }),
  });
  assert.equal(rejected.status, 400);
  assert.equal(
    context.getFlag("platform", "dark-mode")._version,
    original._version,
  );
  assert.equal(
    (
      context.getFlag("platform", "dark-mode").environments.production as {
        on: boolean;
      }
    ).on,
    false,
  );

  const preview = await request(
    "/api/v2/flags/platform/dark-mode?dryRun=true",
    {
      method: "PATCH",
      headers: {
        "content-type":
          "application/json; domain-model=launchdarkly.semanticpatch",
      },
      body: JSON.stringify({
        environmentKey: "production",
        instructions: [{ kind: "turnFlagOn" }],
      }),
    },
  );
  assert.equal(preview.status, 200);
  assert.equal(
    (
      (await preview.json()) as {
        environments: { production: { on: boolean } };
      }
    ).environments.production.on,
    true,
  );
  assert.equal(
    (
      context.getFlag("platform", "dark-mode").environments.production as {
        on: boolean;
      }
    ).on,
    false,
  );
});

import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { Context } from "../routes/_.context.ts";
import { GET as getLicense } from "../routes/licenses/{license}.ts";
import { GET as getLicenses } from "../routes/licenses.ts";
import { seedGitHub } from "../scenarios/index.ts";
import { createContextHarness } from "../test-support/create-context.ts";

type RouteResult = { status: number; body?: unknown };

const createResponse = () =>
  new Proxy(
    {},
    {
      get: (_, key) => ({
        json: (body: unknown): RouteResult => ({ status: Number(key), body }),
        empty: (): RouteResult => ({ status: Number(key) }),
        random: (): RouteResult => ({ status: Number(key) }),
      }),
    },
  ) as never;

const create$ = ({
  context,
  path = {},
  query = {},
}: {
  context: Context;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
}) =>
  ({
    context,
    path,
    query,
    response: createResponse(),
  }) as never;

const createSeededContext = () => {
  const { context, loadContext } = createContextHarness();
  seedGitHub({
    context,
    loadContext,
    routes: {},
    route: () => ({}),
  });
  return context;
};

const startServer = async () => {
  const context = createSeededContext();
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const path = url.pathname;
    const query = Object.fromEntries(url.searchParams.entries());

    if (req.method === "GET" && path === "/licenses") {
      const result = (await getLicenses(
        create$({ context, query }) as never,
      )) as RouteResult;
      res.writeHead(result.status, { "content-type": "application/json" });
      res.end(JSON.stringify(result.body));
      return;
    }

    const match = path.match(/^\/licenses\/([^/]+)$/);
    if (req.method === "GET" && match) {
      const [, license] = match;
      const result = (await getLicense(
        create$({ context, path: { license } }) as never,
      )) as RouteResult;
      res.writeHead(result.status, { "content-type": "application/json" });
      res.end(result.body === undefined ? undefined : JSON.stringify(result.body));
      return;
    }

    res.writeHead(404);
    res.end();
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to start license route server");
  }

  return {
    request: (pathname: string) =>
      fetch(`http://127.0.0.1:${address.port}${pathname}`),
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
};

test("licenses routes return deterministic list and lookup data", async () => {
  const server = await startServer();

  try {
    const listed = await server.request("/licenses?featured=true");
    assert.equal(listed.status, 200);
    assert.equal(listed.headers.get("content-type"), "application/json");
    const licenses = (await listed.json()) as Array<{ key: string }>;
    assert.deepEqual(
      licenses.map((license) => license.key),
      ["apache-2.0", "bsd-3-clause", "gpl-3.0", "mit"],
    );

    const found = await server.request("/licenses/mit");
    assert.equal(found.status, 200);
    assert.equal(((await found.json()) as { key: string }).key, "mit");

    const missing = await server.request("/licenses/not-a-license");
    assert.equal(missing.status, 404);
    assert.equal(await missing.text(), "");
  } finally {
    await server.close();
  }
});

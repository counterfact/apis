import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { Context } from "../routes/_.context.ts";
import { GET as getRateLimit } from "../routes/rate_limit.ts";
import { seedGitHub } from "../scenarios/index.ts";
import { createContextHarness } from "../test-support/create-context.ts";

type RouteResult = {
  status: number;
  body?: unknown;
  headers: Record<string, unknown>;
};

const createResponse = () =>
  new Proxy(
    {},
    {
      get: (_, statusKey) => {
        const withHeaders: Record<string, unknown> = {};
        const builder: Record<string, unknown> = {
          header: (name: string, value: unknown) => {
            withHeaders[name] = value;
            return builder;
          },
          json: (body: unknown): RouteResult => ({
            status: Number(statusKey),
            body,
            headers: { ...withHeaders },
          }),
          empty: (): RouteResult => ({
            status: Number(statusKey),
            headers: { ...withHeaders },
          }),
          random: (): RouteResult => ({
            status: Number(statusKey),
            headers: { ...withHeaders },
          }),
        };
        return builder;
      },
    },
  ) as never;

const create$ = ({ context }: { context: Context }) =>
  ({
    context,
    path: {},
    query: {},
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
    if (req.method === "GET" && req.url === "/rate_limit") {
      const result = (await getRateLimit(
        create$({ context }) as never,
      )) as RouteResult;
      res.writeHead(result.status, {
        "content-type": "application/json",
        "x-ratelimit-limit": String(result.headers["X-RateLimit-Limit"] ?? ""),
        "x-ratelimit-remaining": String(
          result.headers["X-RateLimit-Remaining"] ?? "",
        ),
        "x-ratelimit-reset": String(result.headers["X-RateLimit-Reset"] ?? ""),
      });
      res.end(JSON.stringify(result.body));
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
    throw new Error("Failed to start rate limit route server");
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

test("GET /rate_limit returns 200 with rate limit overview", async () => {
  const server = await startServer();

  try {
    const response = await server.request("/rate_limit");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "application/json");

    const body = (await response.json()) as {
      resources: {
        core: { limit: number; remaining: number; used: number; reset: number };
        search: { limit: number; remaining: number };
      };
      rate: { limit: number; remaining: number };
    };

    assert.ok(body.resources, "response should have resources");
    assert.ok(body.resources.core, "resources should include core");
    assert.equal(body.resources.core.limit, 5000);
    assert.equal(typeof body.resources.core.remaining, "number");
    assert.equal(typeof body.resources.core.reset, "number");
    assert.ok(body.resources.search, "resources should include search");
    assert.equal(body.resources.search.limit, 30);
    assert.deepEqual(body.rate, body.resources.core, "rate should mirror core");
  } finally {
    await server.close();
  }
});

test("GET /rate_limit returns X-RateLimit headers", async () => {
  const server = await startServer();

  try {
    const response = await server.request("/rate_limit");
    assert.equal(response.status, 200);

    const limitHeader = response.headers.get("x-ratelimit-limit");
    const remainingHeader = response.headers.get("x-ratelimit-remaining");
    const resetHeader = response.headers.get("x-ratelimit-reset");

    assert.ok(limitHeader, "X-RateLimit-Limit header should be present");
    assert.ok(
      remainingHeader,
      "X-RateLimit-Remaining header should be present",
    );
    assert.ok(resetHeader, "X-RateLimit-Reset header should be present");
    assert.equal(Number(limitHeader), 5000);
    assert.equal(Number(remainingHeader), 5000);
    assert.ok(Number(resetHeader) > 0, "reset should be a positive timestamp");
  } finally {
    await server.close();
  }
});

test("GET /rate_limit rate field mirrors core resource", async () => {
  const server = await startServer();

  try {
    const response = await server.request("/rate_limit");
    assert.equal(response.status, 200);

    const body = (await response.json()) as {
      resources: { core: { limit: number; remaining: number; reset: number } };
      rate: { limit: number; remaining: number; reset: number };
    };

    assert.deepEqual(
      body.rate,
      body.resources.core,
      "rate object should equal core resource",
    );
  } finally {
    await server.close();
  }
});

import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { POST as postMarkdown } from "../routes/markdown.ts";
import { POST as postMarkdownRaw } from "../routes/markdown/raw.ts";
import { createContextHarness } from "../test-support/create-context.ts";
import { createResponse } from "../test-support/create-response.ts";

type RouteResult = {
  status: number;
  body?: unknown;
  headers: Record<string, string>;
};

const createContextForTest = () => createContextHarness().context;

const startServer = async () => {
  const context = createContextForTest();

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");

    const readBody = () =>
      new Promise<string>((resolve) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });

    if (req.method === "POST" && url.pathname === "/markdown") {
      const raw = await readBody();
      const parsed = JSON.parse(raw) as {
        text: string;
        mode?: "markdown" | "gfm";
        context?: string;
      };
      const result = (await postMarkdown({
        body: parsed,
        context,
        response: createResponse(),
      } as never)) as RouteResult;
      res.writeHead(result.status, result.headers);
      res.end(String(result.body ?? ""));
      return;
    }

    if (req.method === "POST" && url.pathname === "/markdown/raw") {
      const rawBody = await readBody();
      const result = (await postMarkdownRaw({
        body: rawBody,
        context,
        response: createResponse(),
      } as never)) as RouteResult;
      res.writeHead(result.status, result.headers);
      res.end(String(result.body ?? ""));
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
    throw new Error("Failed to start markdown route server");
  }

  return {
    post: (pathname: string, body: string, contentType = "application/json") =>
      fetch(`http://127.0.0.1:${address.port}${pathname}`, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body,
      }),
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
};

test("POST /markdown returns 200 with HTML for a heading", async () => {
  const server = await startServer();
  try {
    const res = await server.post(
      "/markdown",
      JSON.stringify({ text: "# Hello World" }),
    );
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.ok(
      body.includes("<h1>Hello World</h1>"),
      `unexpected body: ${body}`,
    );
  } finally {
    await server.close();
  }
});

test("POST /markdown returns Content-Type text/html and X-CommonMarker-Version header", async () => {
  const server = await startServer();
  try {
    const res = await server.post(
      "/markdown",
      JSON.stringify({ text: "Hello" }),
    );
    assert.equal(res.status, 200);
    assert.ok(
      (res.headers.get("content-type") ?? "").includes("text/html"),
      "should have text/html content type",
    );
    assert.ok(
      res.headers.get("x-commonmarker-version"),
      "should have X-CommonMarker-Version header",
    );
  } finally {
    await server.close();
  }
});

test("POST /markdown in gfm mode renders issue reference links", async () => {
  const server = await startServer();
  try {
    const res = await server.post(
      "/markdown",
      JSON.stringify({
        text: "See #42 for the fix",
        mode: "gfm",
        context: "octocat/hello-world",
      }),
    );
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.ok(
      body.includes('href="https://github.com/octocat/hello-world/issues/42"'),
      `should contain issue link href, got: ${body}`,
    );
  } finally {
    await server.close();
  }
});

test("POST /markdown/raw returns 200 with HTML for plain text markdown", async () => {
  const server = await startServer();
  try {
    const res = await server.post(
      "/markdown/raw",
      "# Raw Heading\n\nSome **bold** text.",
      "text/plain",
    );
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.ok(
      body.includes("<h1>Raw Heading</h1>"),
      `should render heading, got: ${body}`,
    );
    assert.ok(
      body.includes("<strong>bold</strong>"),
      `should render bold, got: ${body}`,
    );
  } finally {
    await server.close();
  }
});

test("POST /markdown/raw returns X-CommonMarker-Version header", async () => {
  const server = await startServer();
  try {
    const res = await server.post("/markdown/raw", "Hello", "text/plain");
    assert.equal(res.status, 200);
    assert.ok(
      res.headers.get("x-commonmarker-version"),
      "should have X-CommonMarker-Version header",
    );
  } finally {
    await server.close();
  }
});

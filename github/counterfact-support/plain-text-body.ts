import type { Server } from "node:http";

const MARKDOWN_CONTENT_TYPES = new Set(["text/plain", "text/x-markdown"]);
const MAX_MARKDOWN_BYTES = 400 * 1024;

type RequestContext = {
  req: AsyncIterable<Uint8Array | string>;
  request: {
    body?: unknown;
    headers: Record<string, string | string[] | undefined>;
    method: string;
    rawBody?: string;
  };
  body?: unknown;
  status?: number;
};

export type KoaLikeApp = {
  middleware: Array<
    (context: RequestContext, next: () => Promise<unknown>) => unknown
  >;
  listen(...args: unknown[]): Server;
};

export const installPlainTextBodyParser = (app: KoaLikeApp) => {
  const plainTextBodyParser = async (
    context: RequestContext,
    next: () => Promise<unknown>,
  ) => {
    const contentType = String(context.request.headers["content-type"] ?? "")
      .split(";", 1)[0]
      ?.trim()
      .toLowerCase();
    if (
      context.request.method !== "POST" ||
      !contentType ||
      !MARKDOWN_CONTENT_TYPES.has(contentType)
    ) {
      return next();
    }

    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of context.req) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.byteLength;
      if (size > MAX_MARKDOWN_BYTES) {
        context.status = 413;
        context.body = "Markdown body exceeds 400 KB";
        return undefined;
      }
      chunks.push(buffer);
    }
    const body = Buffer.concat(chunks).toString("utf8");
    context.request.body = body;
    context.request.rawBody = body;
    return next();
  };

  const bodyParserIndex = app.middleware.findIndex(
    (middleware) => middleware.name === "bodyParser",
  );
  app.middleware.splice(
    bodyParserIndex >= 0
      ? bodyParserIndex
      : Math.max(0, app.middleware.length - 2),
    0,
    plainTextBodyParser,
  );
};

import { once } from "node:events";
import type { Server } from "node:http";
import { fileURLToPath } from "node:url";
import { installPlainTextBodyParser } from "../counterfact-support/plain-text-body.js";
import type { Context } from "../routes/_.context.ts";

process.env.CHOKIDAR_USEPOLLING ??= "1";
const { counterfact } = await import("counterfact");

const basePath = fileURLToPath(new URL("../", import.meta.url));
const openApiPath = fileURLToPath(new URL("../openapi.yaml", import.meta.url));

export const startCounterfactServer = async () => {
  const config = {
    adminApiToken: "",
    alwaysFakeOptionals: false,
    basePath,
    buildCache: false,
    generate: { prune: false, routes: false, types: false },
    openApiPath,
    port: 0,
    prefix: "",
    proxyPaths: new Map([["", false]]),
    proxyUrl: "",
    startAdminApi: false,
    startRepl: false,
    startServer: true,
    validateRequests: true,
    validateResponses: true,
    watch: { routes: false, types: false },
  };
  const app = await counterfact(config);
  installPlainTextBodyParser(app.koaApp);
  let httpServer: Server | undefined;
  const listen = app.koaApp.listen.bind(app.koaApp);
  app.koaApp.listen = (...args: unknown[]) => {
    httpServer = listen(...args);
    return httpServer;
  };
  const server = await app.start(config);
  if (!httpServer) {
    await server.stop();
    throw new Error("Counterfact did not create an HTTP server");
  }
  if (!httpServer.listening) await once(httpServer, "listening");
  const address = httpServer.address();
  if (!address || typeof address !== "object") {
    await server.stop();
    throw new Error("failed to determine Counterfact port");
  }
  const port = address.port;
  const context = app.contextRegistry.find("/") as Context;

  return {
    context,
    contextAt: <T>(path: string) => app.contextRegistry.find(path) as T,
    fetch: (pathname: string, init?: RequestInit) =>
      globalThis.fetch(`http://127.0.0.1:${port}${pathname}`, init),
    stop: async () => server.stop(),
  };
};

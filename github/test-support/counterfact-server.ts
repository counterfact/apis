import net from "node:net";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";
import type { Context } from "../routes/_.context.ts";

const basePath = fileURLToPath(new URL("../", import.meta.url));
const openApiPath = fileURLToPath(new URL("../openapi.yaml", import.meta.url));

const getFreePort = async () =>
  new Promise<number>((resolve, reject) => {
    const temporaryServer = net.createServer();
    temporaryServer.listen(0, "127.0.0.1", () => {
      const address = temporaryServer.address();
      if (address && typeof address === "object") resolve(address.port);
      else reject(new Error("failed to determine free port"));
      temporaryServer.close();
    });
    temporaryServer.on("error", reject);
  });

export const startCounterfactServer = async () => {
  const port = await getFreePort();
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
    validateRequests: true,
    validateResponses: true,
    watch: { routes: false, types: false },
  };
  const app = await counterfact(config);
  const server = await app.start(config);
  const context = app.contextRegistry.find("/") as Context;

  return {
    context,
    contextAt: <T>(path: string) => app.contextRegistry.find(path) as T,
    fetch: (pathname: string, init?: RequestInit) =>
      globalThis.fetch(`http://127.0.0.1:${port}${pathname}`, init),
    stop: async () => server.stop(),
  };
};

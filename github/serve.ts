import { fileURLToPath } from "node:url";
import { installPlainTextBodyParser } from "./counterfact-support/plain-text-body.js";

process.env.CHOKIDAR_USEPOLLING ??= "1";
const { counterfact } = await import("counterfact");

const basePath = fileURLToPath(new URL("./", import.meta.url));
const openApiPath = fileURLToPath(new URL("./openapi.yaml", import.meta.url));
const configuredPort = Number(process.env.COUNTERFACT_PORT ?? 3100);
const port = Number.isInteger(configuredPort) ? configuredPort : 3100;
const withRepl = process.argv.includes("--repl");

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
installPlainTextBodyParser(app.koaApp);
const server = await app.start(config);

if (withRepl) {
  void app.startRepl();
}

const stop = async () => {
  await server.stop();
};
process.once("SIGINT", () => void stop());
process.once("SIGTERM", () => void stop());

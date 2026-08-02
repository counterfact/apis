import path from "node:path";

// Counterfact keeps lightweight context/store watchers active even when route
// generation watching is disabled. Polling avoids low macOS file-descriptor
// limits while preserving Counterfact's supported programmatic lifecycle.
process.env.CHOKIDAR_USEPOLLING = "true";
const { counterfact } = await import("counterfact");

const root = path.resolve(import.meta.dirname, "..");
const configuredPort = Number(process.env.ORDERGROOVE_SIMULATOR_PORT ?? 3100);

if (
  !Number.isInteger(configuredPort) ||
  configuredPort < 1 ||
  configuredPort > 65_535
) {
  throw new Error(
    "ORDERGROOVE_SIMULATOR_PORT must be an integer from 1 to 65535",
  );
}

const { start } = await counterfact({
  openApiPath: path.join(root, "openapi.yaml"),
  basePath: root,
  port: configuredPort,
  startServer: true,
  startRepl: false,
  generate: { routes: false, types: false },
  watch: { routes: false, types: false },
  alwaysFakeOptionals: false,
  buildCache: false,
  proxyPaths: new Map(),
  proxyUrl: "",
  prefix: "",
  validateRequests: true,
  validateResponses: true,
  noUpdateCheck: true,
});

const running = await start({
  startServer: true,
  generate: { routes: false, types: false },
  watch: { routes: false, types: false },
  buildCache: false,
});

console.log(
  `Ordergroove simulator listening at http://localhost:${configuredPort}`,
);

let stopping = false;
const stop = async () => {
  if (stopping) return;
  stopping = true;
  await running.stop();
};

process.once("SIGINT", () => void stop());
process.once("SIGTERM", () => void stop());

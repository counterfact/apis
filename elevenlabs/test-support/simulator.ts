import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { counterfact, type SpecConfig } from "counterfact";
import { load } from "js-yaml";

export async function startSimulator() {
  const basePath = fileURLToPath(new URL("../", import.meta.url));
  const config = load(
    await readFile(new URL("../counterfact.yaml", import.meta.url), "utf8"),
  ) as { spec: SpecConfig[] };
  const specs = config.spec.map((spec) => ({
    ...spec,
    source: fileURLToPath(
      new URL(spec.source, new URL("../", import.meta.url)),
    ),
  }));
  const app = await counterfact(
    {
      basePath,
      port: 0,
      buildCache: false,
      generate: { routes: false, types: false },
      watch: { routes: false, types: false },
      startRepl: false,
      startAdminApi: false,
      validateRequests: true,
      validateResponses: true,
    },
    specs,
  );
  const server = await app.start();
  const port = app.status().address?.port;
  if (!port) {
    await server.stop();
    throw new Error("Simulator did not start listening");
  }
  const request = (path: string, init?: RequestInit) =>
    fetch(`http://127.0.0.1:${port}${path}`, init);
  return { app, server, request };
}

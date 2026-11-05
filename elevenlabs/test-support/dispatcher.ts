import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  ContextRegistry,
  Dispatcher,
  ModuleLoader,
  Registry,
  ScenarioRegistry,
  loadOpenApiDocument,
  resolveScenario,
} from "@counterfact/runtime";
import { load } from "js-yaml";
import type { SpecConfig } from "counterfact";

/** Project-local integration harness: no listener, watchers, or Koa body parser. */
export async function createDispatcherHarness() {
  const root = new URL("../", import.meta.url);
  const { spec: specs } = load(
    await readFile(new URL("counterfact.yaml", root), "utf8"),
  ) as { spec: SpecConfig[] };
  if (specs.some((spec) => spec.group !== "api")) {
    throw new Error("This harness supports only the ElevenLabs api group");
  }
  const registry = new Registry();
  const contexts = new ContextRegistry();
  const scenarios = new ScenarioRegistry();
  const loader = new ModuleLoader(
    fileURLToPath(new URL("api/routes", root)), registry, contexts,
    fileURLToPath(new URL("api/scenarios", root)), scenarios,
  );
  await loader.load();
  const versions = specs.map((spec) => spec.version ?? "");
  const runners = await Promise.all(specs.map(async (spec) => ({
    prefix: (spec.prefix ?? "").replace(/\/$/, ""),
    dispatcher: new Dispatcher(registry, contexts,
      await loadOpenApiDocument(fileURLToPath(new URL(spec.source, root))),
      { alwaysFakeOptionals: false, validateRequests: true, validateResponses: true },
      spec.version, versions),
  })));
  const unsupportedRoutes = () => {
    throw new Error("Scenario route clients are not supported by this harness");
  };
  const scenario = async (name: string, group = "api") => {
    if (group !== "api") throw new Error(`Unknown API group: ${group}`);
    await resolveScenario(scenarios, name)({
      context: contexts.find("/"),
      loadContext: (path) => contexts.find(path),
      route: unsupportedRoutes,
      routes: new Proxy({}, { get: unsupportedRoutes }),
    });
  };
  await scenario("startup");

  const dispatch = async (path: string, init: RequestInit = {}, multipartBody?: Record<string, unknown>) => {
    const url = new URL(path, "http://dispatcher.invalid");
    const runner = runners.find(({ prefix }) =>
      url.pathname === prefix || url.pathname.startsWith(`${prefix}/`));
    if (!runner) return new Response(null, { status: 404 });
    const headers = new Headers(init.headers);
    let body: unknown = multipartBody;
    if (init.body != null) {
      if (typeof init.body !== "string" ||
        headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
        throw new Error("Dispatcher harness accepts only JSON string request bodies");
      }
      body = JSON.parse(init.body);
    }
    const query: Record<string, string | string[]> = {};
    for (const key of new Set(url.searchParams.keys())) {
      const values = url.searchParams.getAll(key);
      query[key] = values.length === 1 ? values[0] : values;
    }
    const localPath = url.pathname.slice(runner.prefix.length) || "/";
    const result = await runner.dispatcher.request({
      method: (init.method ?? "GET").toUpperCase(), path: localPath,
      headers: Object.fromEntries(headers), query, body,
      rawBody: typeof init.body === "string" ? init.body : undefined,
      req: { path: url.pathname },
    });
    const responseHeaders = new Headers();
    for (const [key, value] of Object.entries(result.headers ?? {})) {
      for (const item of Array.isArray(value) ? value : [value]) {
        responseHeaders.append(key, String(item));
      }
    }
    if (result.contentType) responseHeaders.set("content-type", result.contentType);
    for (const [key, value] of result.appendedHeaders ?? []) responseHeaders.append(key, value);
    if (result.body && typeof result.body === "object" && Symbol.asyncIterator in result.body) {
      throw new Error("Streaming responses are not supported by this harness");
    }
    const responseBody = result.body == null ? null :
      typeof result.body === "string" ? result.body :
        result.body instanceof Uint8Array ? new Uint8Array(result.body) :
          JSON.stringify(result.body);
    return new Response(responseBody, { status: result.status ?? 200, headers: responseHeaders });
  };
  const request = (path: string, init: RequestInit = {}) => dispatch(path, init);
  // Supply the public runtime's already-parsed multipart body. Transport parsing
  // belongs to Counterfact; simulator integration tests exercise its validators.
  const requestMultipart = (path: string, body: Record<string, unknown>, init: RequestInit = {}) => {
    if (init.body != null) throw new Error("Supply multipart fields through the body argument");
    const headers = new Headers(init.headers);
    headers.set("content-type", "multipart/form-data; boundary=simulator-test");
    return dispatch(path, { ...init, method: init.method ?? "POST", headers }, body);
  };
  return { scenario, request, requestMultipart };
}

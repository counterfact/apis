import { fileURLToPath } from "node:url";
import { ContextRegistry, ModuleLoader, Registry } from "@counterfact/runtime";
import { Context } from "../api/routes/_.context.js";
import type { Scenario, Scenario$ } from "../api/types/_.context.js";

/** Load real context classes so direct tests share scenario setup with the runtime. */
export async function createScenarioRunner(context = new Context()) {
  const contexts = new ContextRegistry();
  const loader = new ModuleLoader(
    fileURLToPath(new URL("../api/routes", import.meta.url)),
    new Registry(), contexts,
  );
  await loader.load();
  contexts.add("/", context as unknown as Parameters<ContextRegistry["add"]>[1]);
  const loadContext = ((path: string) => contexts.find(path)) as Scenario$["loadContext"];
  const unsupportedRoutes = () => {
    throw new Error("Scenario route clients are not supported by direct context tests");
  };
  return {
    context,
    loadContext,
    run: async (scenario: Scenario) => {
      await scenario({ context, loadContext, routes: {}, route: unsupportedRoutes });
    },
  };
}

const runners = new WeakMap<Context, ReturnType<typeof createScenarioRunner>>();

/** Retain child contexts across scenario calls for each directly tested root. */
export async function runScenario(context: Context, scenario: Scenario) {
  let runner = runners.get(context);
  if (!runner) {
    runner = createScenarioRunner(context);
    runners.set(context, runner);
  }
  await (await runner).run(scenario);
}

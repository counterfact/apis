import type { Context$ } from "../types/_.context.ts";
import { Context } from "../routes/_.context.ts";
import { Context as GistsContext } from "../routes/gists/_.context.ts";
import { Context as ReposContext } from "../routes/repos/_.context.ts";
import { Context as UsersContext } from "../routes/users/_.context.ts";

export const createContextHarness = () => {
  const contexts = new Map<string, unknown>();
  let rootContext: Context | undefined;

  const loadContext: Context$["loadContext"] = ((path: string) => {
    if (path === "/") {
      if (!rootContext) {
        throw new Error("Root context has not been initialized");
      }
      return rootContext;
    }

    const existing = contexts.get(path);
    if (existing) {
      return existing;
    }

    let created: unknown;
    switch (path) {
      case "/gists":
        created = new GistsContext({ loadContext, readJson: async () => ({}) });
        break;
      case "/users":
        created = new UsersContext({ loadContext, readJson: async () => ({}) });
        break;
      case "/repos":
        created = new ReposContext({ loadContext, readJson: async () => ({}) });
        break;
      default:
        throw new Error(`Unknown context path: ${path}`);
    }

    contexts.set(path, created);
    return created;
  }) as Context$["loadContext"];

  rootContext = new Context({ loadContext, readJson: async () => ({}) });

  return {
    context: rootContext,
    loadContext,
  };
};

export const createContext = () => createContextHarness().context;

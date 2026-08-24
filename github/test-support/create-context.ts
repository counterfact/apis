import type { Context$ } from "../types/_.context.ts";
import { Context } from "../routes/_.context.ts";
import { Context as CodesOfConductContext } from "../routes/codes_of_conduct/_.context.ts";
import { Context as EmojisContext } from "../routes/emojis/_.context.ts";
import { Context as GistsContext } from "../routes/gists/_.context.ts";
import { Context as GitignoreContext } from "../routes/gitignore/_.context.ts";
import { Context as LicensesContext } from "../routes/licenses/_.context.ts";
import { Context as MarkdownContext } from "../routes/markdown/_.context.ts";
import { Context as MetaContext } from "../routes/meta/_.context.ts";
import { Context as NotificationsContext } from "../routes/notifications/_.context.ts";
import { Context as RateLimitContext } from "../routes/rate_limit/_.context.ts";
import { Context as ReposContext } from "../routes/repos/_.context.ts";
import { Context as AuthenticatedUserContext } from "../routes/user/_.context.ts";
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
      case "/codes_of_conduct":
        created = new CodesOfConductContext({
          loadContext,
          readJson: async () => ({}),
        });
        break;
      case "/emojis":
        created = new EmojisContext({
          loadContext,
          readJson: async () => ({}),
        });
        break;
      case "/gists":
        created = new GistsContext({ loadContext, readJson: async () => ({}) });
        break;
      case "/gitignore":
        created = new GitignoreContext({
          loadContext,
          readJson: async () => ({}),
        });
        break;
      case "/licenses":
        created = new LicensesContext({
          loadContext,
          readJson: async () => ({}),
        });
        break;
      case "/markdown":
        created = new MarkdownContext({
          loadContext,
          readJson: async () => ({}),
        });
        break;
      case "/meta":
        created = new MetaContext({
          loadContext,
          readJson: async () => ({}),
        });
        break;
      case "/notifications":
        created = new NotificationsContext({
          loadContext,
          readJson: async () => ({}),
        });
        break;
      case "/rate_limit":
        created = new RateLimitContext({
          loadContext,
          readJson: async () => ({}),
        });
        break;
      case "/users":
        created = new UsersContext({ loadContext, readJson: async () => ({}) });
        break;
      case "/user":
        created = new AuthenticatedUserContext({
          loadContext,
          readJson: async () => ({}),
        });
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

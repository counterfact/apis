declare module "counterfact" {
  import type { KoaLikeApp } from "./counterfact-support/plain-text-body.js";

  type CounterfactConfig = Record<string, unknown>;

  export const counterfact: (config: CounterfactConfig) => Promise<{
    contextRegistry: { find(path: string): unknown };
    koaApp: KoaLikeApp;
    start(config: CounterfactConfig): Promise<{ stop(): Promise<void> }>;
    startRepl(): Promise<unknown>;
  }>;
}

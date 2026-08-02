// Counterfact 2.16.0's package metadata references dist/server/types.d.ts, but
// that file is absent from the published tarball. This declaration isolates the
// exact programmatic surface used by HTTP tests; see https://counterfact.dev/docs/reference/.
declare module "counterfact" {
  export interface CounterfactConfig {
    openApiPath: string;
    basePath: string;
    port: number;
    startServer: boolean;
    startRepl: boolean;
    generate: { routes: boolean; types: boolean };
    watch: { routes: boolean; types: boolean };
    alwaysFakeOptionals: boolean;
    buildCache: boolean;
    proxyPaths: Map<string, boolean>;
    proxyUrl: string;
    prefix: string;
    validateRequests: boolean;
    validateResponses: boolean;
    noUpdateCheck: boolean;
  }

  export interface CounterfactStartOptions {
    startServer: boolean;
    generate: { routes: boolean; types: boolean };
    watch: { routes: boolean; types: boolean };
    buildCache: boolean;
  }

  export function counterfact(config: CounterfactConfig): Promise<{
    start(options: CounterfactStartOptions): Promise<{
      stop(): Promise<void>;
    }>;
  }>;
}

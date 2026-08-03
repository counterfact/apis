declare module "counterfact" {
  interface CounterfactApplication {
    contextRegistry: {
      find(path: string): unknown;
    };
    start(config: unknown): Promise<{ stop(): Promise<void> }>;
  }

  export function counterfact(config: unknown): Promise<CounterfactApplication>;
}

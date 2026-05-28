import type { runner } from "../../../components/schemas/runner.js";

export type actions_runner_jitconfig = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: {
        runner: runner;
        /**
         * The base64 encoded runner configuration.
         */
        encoded_jit_config: string;
      };
    };
  };
  examples: {
    default: unknown;
  };
};

import type { runner_label } from "../../../components/schemas/runner-label.js";

export type actions_runner_labels = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: { total_count: number; labels: Array<runner_label> };
    };
  };
  examples: {
    default: unknown;
  };
};

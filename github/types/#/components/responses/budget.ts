import type { get_budget } from "../../../components/schemas/get-budget.js";

export type budget = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: get_budget;
    };
  };
  examples: {
    default: unknown;
  };
};

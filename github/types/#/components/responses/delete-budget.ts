import type { delete_budget } from "../../../components/schemas/delete-budget.js";

export type delete_budget = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: delete_budget;
    };
  };
  examples: {
    default: unknown;
  };
};

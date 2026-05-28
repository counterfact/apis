import type { get_all_budgets } from "../../../components/schemas/get_all_budgets.js";

export type get_all_budgets = {
  headers: never;
  requiredHeaders: never;
  content: {
    "application/json": {
      schema: get_all_budgets;
    };
  };
  examples: {
    default: unknown;
  };
};

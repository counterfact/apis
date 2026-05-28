import type { budget } from "./budget.js";

export type get_all_budgets = {
  /**
   * Array of budget objects for the enterprise
   */
  budgets: Array<budget>;
  /**
   * Indicates if there are more pages of results available (maps to hasNextPage from billing platform)
   */
  has_next_page?: boolean;
  /**
   * Total number of budgets matching the query
   */
  total_count?: number;
};

import type { SearchStrategy } from "./SearchStrategy.js";
export type KnowledgeBaseToolInfo = {
  /**
   * Search strategies exposed to the model. Must be non-empty.
   */
  enabled_strategies?: Array<SearchStrategy>;
};

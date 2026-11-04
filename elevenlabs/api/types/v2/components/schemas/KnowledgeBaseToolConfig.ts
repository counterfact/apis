import type { SearchStrategy } from "./SearchStrategy.js";
export type KnowledgeBaseToolConfig = {
  /**
   * @default "knowledge_base"
   */
  system_tool_type?: "knowledge_base";
  enabled_strategies?: Array<SearchStrategy>;
};

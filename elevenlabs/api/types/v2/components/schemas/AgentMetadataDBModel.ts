import type { AgentDefinitionSource } from "./AgentDefinitionSource.js";
export type AgentMetadataDBModel = {
  created_at_unix_secs: number;
  updated_at_unix_secs: number;
  /**
   * @default "unknown"
   */
  created_from?: AgentDefinitionSource;
  /**
   * @default "unknown"
   */
  last_updated_from?: AgentDefinitionSource;
};

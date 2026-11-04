export type PromptAgentAPIModelOverrideConfig = {
  /**
   * Whether to allow overriding the prompt field.
   * @default false
   */
  prompt?: boolean;
  /**
   * Whether to allow overriding the llm field.
   * @default false
   */
  llm?: boolean;
  /**
   * Whether to allow overriding the tool_ids field.
   * @default false
   */
  tool_ids?: boolean;
  /**
   * Whether to allow overriding the tool_ids_strict field.
   * @default false
   */
  tool_ids_strict?: boolean;
  /**
   * Whether to allow overriding the native_mcp_server_ids field.
   * @default false
   */
  native_mcp_server_ids?: boolean;
  /**
   * Whether to allow overriding the knowledge_base field.
   * @default false
   */
  knowledge_base?: boolean;
};

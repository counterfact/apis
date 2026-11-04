export type LLMSchemaOverride = {
  /**
   * @default "llm"
   */
  source?: "llm";
  /**
   * Prompt override for the LLM. If not provided, the original schema description is used.
   */
  prompt?: string | null;
};

export type WorkflowLLMConditionModel_Input = {
  /**
   * Optional human-readable label for the condition used throughout the UI.
   */
  label?: string | null;
  /**
   * @default "llm"
   */
  type?: "llm";
  /**
   * Condition to evaluate
   */
  condition: string;
};

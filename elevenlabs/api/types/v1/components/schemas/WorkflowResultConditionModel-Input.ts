export type WorkflowResultConditionModel_Input = {
  /**
   * Optional human-readable label for the condition used throughout the UI.
   */
  label?: string | null;
  /**
   * @default "result"
   */
  type?: "result";
  /**
   * Whether all tools in the previously executed tool node were executed successfully.
   */
  successful: boolean;
};

export type TestRunMetadata = {
  workspace_id: string;
  test_name: string;
  ran_by_user_email: string;
  /**
   * @default "llm"
   */
  test_type?: "llm" | "tool_call" | "simulation";
};

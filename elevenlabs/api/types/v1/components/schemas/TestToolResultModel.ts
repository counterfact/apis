export type TestToolResultModel = {
  /**
   * @default "testing_tool_result"
   */
  result_type?: "testing_tool_result";
  /**
   * @default "success"
   */
  status?: "success";
  /**
   * @default "Skipping tool call in test mode"
   */
  reason?: string;
  to_agent?: string | null;
  to_node?: string | null;
};

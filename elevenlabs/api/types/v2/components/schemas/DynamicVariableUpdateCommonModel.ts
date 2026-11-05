/**
 * Tracks a dynamic variable update that occurred during tool execution.
 */
export type DynamicVariableUpdateCommonModel = {
  variable_name: string;
  old_value: string | null;
  new_value: string;
  updated_at: number;
  tool_name: string;
  tool_request_id: string;
};

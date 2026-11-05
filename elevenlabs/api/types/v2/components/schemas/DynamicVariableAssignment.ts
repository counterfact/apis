/**
 * Configuration for extracting values from tool responses and assigning them to dynamic variables.
 * @example {"dynamic_variable":"user_name","preserve_native_type":false,"sanitize":false,"source":"response","value_path":"user.name"}
 */
export type DynamicVariableAssignment = {
  /**
   * The source to extract the value from. Currently only 'response' is supported.
   * @default "response"
   */
  source?: "response";
  /**
   * The name of the dynamic variable to assign the extracted value to
   */
  dynamic_variable: string;
  /**
   * Dot notation path to extract the value from the source (e.g., 'user.name' or 'data.0.id')
   */
  value_path: string;
  /**
   * If true, this assignment's value will be removed from the tool response before sending to the LLM and transcript, but still processed for variable assignment.
   * @default false
   */
  sanitize?: boolean;
  /**
   * If true, non-scalar values (lists, objects) extracted from the tool response are stored as their native type instead of being stringified to JSON. Enable this to use extracted arrays directly as list dynamic variables.
   * @default false
   */
  preserve_native_type?: boolean;
};

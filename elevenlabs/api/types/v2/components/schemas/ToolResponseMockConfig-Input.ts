import type { UnitTestToolCallParameter } from "./UnitTestToolCallParameter.js";
export type ToolResponseMockConfig_Input = {
  /**
   * If the list is empty, the mock will always activate.
   */
  parameter_conditions?: Array<UnitTestToolCallParameter>;
  /**
   * The return value the LLM sees when this mock is active.
   */
  mock_result: string;
  /**
   * If true, the mock result is surfaced to the LLM as a tool error rather than a successful result.
   * @default false
   */
  is_error?: boolean;
};

import type { AdhocAgentConfigOverrideForTestRequestModel } from "./AdhocAgentConfigOverrideForTestRequestModel.js";
export type ResubmitTestsRequestModel = {
  /**
   * List of test run IDs to resubmit
   */
  test_run_ids: Array<string>;
  /**
   * Configuration overrides to use for testing. If not provided, the agent's default configuration will be used.
   */
  agent_config_override?: AdhocAgentConfigOverrideForTestRequestModel | null;
  /**
   * Agent ID to resubmit tests for
   */
  agent_id: string;
  /**
   * ID of the branch to run the tests on. If not provided, the tests will be run on the agent's main branch.
   */
  branch_id?: string | null;
};

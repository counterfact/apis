import type { SingleTestRunRequestModel } from "./SingleTestRunRequestModel.js";
import type { AdhocAgentConfigOverrideForTestRequestModel } from "./AdhocAgentConfigOverrideForTestRequestModel.js";
export type RunAgentTestsRequestModel = {
  /**
   * Optional name for the test invocation.
   */
  name?: string | null;
  /**
   * List of tests to run on the agent
   */
  tests: Array<SingleTestRunRequestModel>;
  /**
   * Configuration overrides to use for testing. If not provided, the agent's default configuration will be used.
   */
  agent_config_override?: AdhocAgentConfigOverrideForTestRequestModel | null;
  /**
   * ID of the branch to run the tests on. If not provided, the tests will be run on the agent's main branch.
   */
  branch_id?: string | null;
  /**
   * Number of times to run each test. When greater than 1, results are grouped and summarized.
   * @default 1
   */
  repeat_count?: number;
};

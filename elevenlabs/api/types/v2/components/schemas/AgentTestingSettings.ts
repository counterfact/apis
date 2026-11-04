import type { AttachedTestModel } from "./AttachedTestModel.js";
/**
 * Settings for agent testing configuration.
 * @example {"attached_tests":[{"environment":"staging","test_id":"test_123","workflow_node_id":"node_abc"},{"test_id":"test_456"}],"referenced_tests_ids":["test_123","test_456"]}
 */
export type AgentTestingSettings = {
  /**
   * List of test IDs that should be run for this agent
   */
  attached_tests?: Array<AttachedTestModel>;
};

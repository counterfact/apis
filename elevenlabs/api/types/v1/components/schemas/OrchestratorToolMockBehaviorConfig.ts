import type { MockingStrategy } from "./MockingStrategy.js";
import type { MockNoMatchBehavior } from "./MockNoMatchBehavior.js";
/**
 * Orchestrator-side config: tools are identified by resolved names.
 */
export type OrchestratorToolMockBehaviorConfig = {
  /**
   * Which tools to mock: 'all' mocks every mockable tool, 'selected' mocks only those in mocked_tool_names/mocked_tool_ids, 'none' disables mocking.
   * @default "none"
   */
  mocking_strategy?: MockingStrategy;
  /**
   * Behavior when no mock matches a tool call.
   * @default "raise_error"
   */
  fallback_strategy?: MockNoMatchBehavior;
  /**
   * Tool names to mock. Only used when mocking_strategy is 'selected'.
   */
  mocked_tool_names?: Array<string>;
};

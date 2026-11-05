import type { MockingStrategy } from "./MockingStrategy.js";
import type { MockNoMatchBehavior } from "./MockNoMatchBehavior.js";
/**
 * Simulation/preview-side config: tools are identified by IDs, resolved to names at runtime.
 */
export type SimulationToolMockBehaviorConfig = {
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
   * Tool IDs to mock. Resolved to tool names before being passed to the orchestrator.
   */
  mocked_tool_ids?: Array<string>;
};

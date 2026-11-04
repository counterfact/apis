import type { Position_Output } from "./Position-Output.js";
import type { WorkflowToolLocator } from "./WorkflowToolLocator.js";
export type WorkflowToolNodeModel_Output = {
  /**
   * @default "tool"
   */
  type: "tool";
  /**
   * Position of the node in the workflow.
   */
  position: Position_Output;
  /**
   * The ids of outgoing edges in the order they should be evaluated.
   */
  edge_order: Array<string>;
  /**
   * List of tools to execute in parallel. The entire node is considered successful if all tools are executed successfully.
   */
  tools: Array<WorkflowToolLocator>;
};

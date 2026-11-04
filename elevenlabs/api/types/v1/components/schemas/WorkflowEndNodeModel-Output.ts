import type { Position_Output } from "./Position-Output.js";
import type { WorkflowEndNodeOutcome } from "./WorkflowEndNodeOutcome.js";
export type WorkflowEndNodeModel_Output = {
  /**
   * @default "end"
   */
  type: "end";
  /**
   * Position of the node in the workflow.
   */
  position: Position_Output;
  /**
   * The ids of outgoing edges in the order they should be evaluated.
   */
  edge_order: Array<string>;
  /**
   * Whether reaching this End node ends the conversation as a success or a failure.
   * @default "success"
   */
  outcome: WorkflowEndNodeOutcome;
};

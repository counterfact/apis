import type { Position_Output } from "./Position-Output.js";
export type WorkflowStartNodeModel_Output = {
  /**
   * @default "start"
   */
  type: "start";
  /**
   * Position of the node in the workflow.
   */
  position: Position_Output;
  /**
   * The ids of outgoing edges in the order they should be evaluated.
   */
  edge_order: Array<string>;
};

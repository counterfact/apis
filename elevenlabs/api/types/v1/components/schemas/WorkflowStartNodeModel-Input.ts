import type { Position_Input } from "./Position-Input.js";
export type WorkflowStartNodeModel_Input = {
  /**
   * @default "start"
   */
  type?: "start";
  /**
   * Position of the node in the workflow.
   */
  position?: Position_Input;
  /**
   * The ids of outgoing edges in the order they should be evaluated.
   */
  edge_order?: Array<string>;
};

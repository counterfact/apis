export type WorkflowToolEdgeStepModel = {
  step_latency_secs: number;
  /**
   * @default "edge"
   */
  type?: "edge";
  edge_id: string;
  target_node_id: string;
};

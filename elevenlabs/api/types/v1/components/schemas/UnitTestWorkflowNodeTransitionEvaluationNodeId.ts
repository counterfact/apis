export type UnitTestWorkflowNodeTransitionEvaluationNodeId = {
  /**
   * @default "node_id"
   */
  type?: "node_id";
  /**
   * The ID of the agent whose workflow contains the target node.
   */
  agent_id: string;
  /**
   * The ID of the workflow node that the agent should transition to.
   */
  target_node_id: string;
};

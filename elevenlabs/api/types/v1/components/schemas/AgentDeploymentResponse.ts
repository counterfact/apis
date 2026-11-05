export type AgentDeploymentResponse = {
  /**
   * Map of branch IDs to traffic percentages
   */
  traffic_percentage_branch_id_map?: { [key: string]: number };
};

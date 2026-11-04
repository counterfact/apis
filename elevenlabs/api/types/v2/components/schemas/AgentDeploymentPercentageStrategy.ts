export type AgentDeploymentPercentageStrategy = {
  /**
   * @default "percentage"
   */
  type?: "percentage";
  /**
   * Traffic percentage to deploy
   */
  traffic_percentage: number;
};

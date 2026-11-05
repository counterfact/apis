import type { AgentDeploymentPercentageStrategy } from "./AgentDeploymentPercentageStrategy.js";
export type AgentDeploymentRequestItem = {
  /**
   * ID of the branch to deploy
   */
  branch_id: string;
  deployment_strategy: AgentDeploymentPercentageStrategy;
};

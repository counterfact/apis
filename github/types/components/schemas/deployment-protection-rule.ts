import type { custom_deployment_rule_app } from "./custom-deployment-rule-app.js";

/**
 * Deployment protection rule
 */
export type deployment_protection_rule = {
  /**
   * The unique identifier for the deployment protection rule.
   * @example 3515
   */
  id: number;
  /**
   * The node ID for the deployment protection rule.
   * @example "MDQ6R2F0ZTM1MTU="
   */
  node_id: string;
  /**
   * Whether the deployment protection rule is enabled for the environment.
   * @example true
   */
  enabled: boolean;
  app: custom_deployment_rule_app;
};

/**
 * Choose which environments must be successfully deployed to before refs can be pushed into a ref that matches this rule.
 */
export type repository_rule_required_deployments = {
  type: "required_deployments";
  parameters?: {
    /**
     * The environments that must be successfully deployed to before branches can be merged.
     */
    required_deployment_environments: Array<string>;
  };
};

/**
 * A GitHub App that is providing a custom deployment protection rule.
 */
export type custom_deployment_rule_app = {
  /**
   * The unique identifier of the deployment protection rule integration.
   * @example 3515
   */
  id: number;
  /**
   * The slugified name of the deployment protection rule integration.
   * @example "my-custom-app"
   */
  slug: string;
  /**
   * The URL for the endpoint to get details about the app.
   * @example "https://api.github.com/apps/custom-app-slug"
   */
  integration_url: string;
  /**
   * The node ID for the deployment protection rule integration.
   * @example "MDQ6R2F0ZTM1MTU="
   */
  node_id: string;
};

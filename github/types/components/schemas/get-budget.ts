export type get_budget = {
  /**
   * ID of the budget.
   */
  id: string;
  /**
   * The type of scope for the budget
   * @example "enterprise"
   */
  budget_scope: "enterprise" | "organization" | "repository" | "cost_center";
  /**
   * The name of the entity to apply the budget to
   * @example "octocat/hello-world"
   */
  budget_entity_name: string;
  /**
   * The budget amount in whole dollars. For license-based products, this represents the number of licenses.
   */
  budget_amount: number;
  /**
   * Whether to prevent additional spending once the budget is exceeded
   * @example true
   */
  prevent_further_usage: boolean;
  /**
   * A single product or sku to apply the budget to.
   * @example "actions_linux"
   */
  budget_product_sku: string;
  /**
   * The type of pricing for the budget
   * @example "ProductPricing"
   */
  budget_type: "ProductPricing" | "SkuPricing";
  budget_alerting: {
    /**
     * Whether alerts are enabled for this budget
     * @example true
     */
    will_alert?: boolean;
    /**
     * Array of user login names who will receive alerts
     * @example ["mona","lisa"]
     */
    alert_recipients?: Array<string>;
  };
};

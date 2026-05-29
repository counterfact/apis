export type budget = {
  /**
   * The unique identifier for the budget
   * @example "2066deda-923f-43f9-88d2-62395a28c0cdd"
   */
  id: string;
  /**
   * The type of pricing for the budget
   * @example "SkuPricing"
   */
  budget_type: "SkuPricing" | "ProductPricing";
  /**
   * The budget amount limit in whole dollars. For license-based products, this represents the number of licenses.
   */
  budget_amount: number;
  /**
   * The type of limit enforcement for the budget
   * @example true
   */
  prevent_further_usage: boolean;
  /**
   * The scope of the budget (enterprise, organization, repository, cost center)
   * @example "enterprise"
   */
  budget_scope: string;
  /**
   * The name of the entity for the budget (enterprise does not require a name).
   * @example "octocat/hello-world"
   */
  budget_entity_name?: string;
  /**
   * A single product or sku to apply the budget to.
   */
  budget_product_sku: string;
  budget_alerting: {
    /**
     * Whether alerts are enabled for this budget
     * @example true
     */
    will_alert: boolean;
    /**
     * Array of user login names who will receive alerts
     * @example ["mona","lisa"]
     */
    alert_recipients: Array<string>;
  };
};

export type billing_usage_summary_report_user = {
  timePeriod: {
    /**
     * The year for the usage report.
     */
    year: number;
    /**
     * The month for the usage report.
     */
    month?: number;
    /**
     * The day for the usage report.
     */
    day?: number;
  };
  /**
   * The unique identifier of the user.
   */
  user: string;
  /**
   * The name of the repository for the usage report.
   */
  repository?: string;
  /**
   * The product for the usage report.
   */
  product?: string;
  /**
   * The SKU for the usage report.
   */
  sku?: string;
  usageItems: Array<{
    /**
     * Product name.
     */
    product: string;
    /**
     * SKU name.
     */
    sku: string;
    /**
     * Unit type of the usage line item.
     */
    unitType: string;
    /**
     * Price per unit of the usage line item.
     */
    pricePerUnit: number;
    /**
     * Gross quantity of the usage line item.
     */
    grossQuantity: number;
    /**
     * Gross amount of the usage line item.
     */
    grossAmount: number;
    /**
     * Discount quantity of the usage line item.
     */
    discountQuantity: number;
    /**
     * Discount amount of the usage line item.
     */
    discountAmount: number;
    /**
     * Net quantity of the usage line item.
     */
    netQuantity: number;
    /**
     * Net amount of the usage line item.
     */
    netAmount: number;
  }>;
};

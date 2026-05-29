export type billing_usage_report_user = {
  usageItems?: Array<{
    /**
     * Date of the usage line item.
     */
    date: string;
    /**
     * Product name.
     */
    product: string;
    /**
     * SKU name.
     */
    sku: string;
    /**
     * Quantity of the usage line item.
     */
    quantity: number;
    /**
     * Unit type of the usage line item.
     */
    unitType: string;
    /**
     * Price per unit of the usage line item.
     */
    pricePerUnit: number;
    /**
     * Gross amount of the usage line item.
     */
    grossAmount: number;
    /**
     * Discount amount of the usage line item.
     */
    discountAmount: number;
    /**
     * Net amount of the usage line item.
     */
    netAmount: number;
    /**
     * Name of the repository.
     */
    repositoryName?: string;
  }>;
};

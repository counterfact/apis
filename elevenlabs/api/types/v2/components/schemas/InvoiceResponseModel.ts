import type { DiscountResponseModel } from "./DiscountResponseModel.js";
/**
 * @example {"amount_due_cents":1000,"discounts":[{"discount_percent_off":20}],"next_payment_attempt_unix":1738356858,"payment_intent_status":"processing","payment_intent_statusses":["processing","succeeded"],"subtotal_cents":900,"tax_cents":100}
 */
export type InvoiceResponseModel = {
  /**
   * The amount due in cents.
   */
  amount_due_cents: number;
  /**
   * The subtotal amount in cents before tax (exclusive of tax and discounts).
   */
  subtotal_cents?: number | null;
  /**
   * The tax amount in cents.
   */
  tax_cents?: number | null;
  /**
   * Deprecated. Use [discounts] instead. The discount applied to the invoice. E.g. [20.0f] for 20% off.
   */
  discount_percent_off?: number | null;
  /**
   * Deprecated. Use [discounts] instead. The discount applied to the invoice. E.g. [20.0f] for 20 cents off.
   */
  discount_amount_off?: number | null;
  /**
   * The discounts applied to the invoice.
   */
  discounts: Array<DiscountResponseModel>;
  /**
   * The Unix timestamp of the next payment attempt. -1 when there is no next payment attempt.
   */
  next_payment_attempt_unix: number;
  /**
   * Deprecated. Use [payment_intent_statusses] instead. The status of this invoice's first payment intent. None when there is no payment intent.
   */
  payment_intent_status:
    | (
        | "canceled"
        | "processing"
        | "requires_action"
        | "requires_capture"
        | "requires_confirmation"
        | "requires_payment_method"
        | "succeeded"
      )
    | null;
  /**
   * The statuses of this invoice's payment intents. Empty list when there are no payment intents.
   */
  payment_intent_statusses: Array<
    | "canceled"
    | "processing"
    | "requires_action"
    | "requires_capture"
    | "requires_confirmation"
    | "requires_payment_method"
    | "succeeded"
  >;
};

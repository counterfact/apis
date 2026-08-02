import type { customersCreate } from "../../types/paths/customers/create.types.js";
import { DomainError } from "../../domain/store.ts";

export const POST: customersCreate = async ($) => {
  // Source: https://developer.ordergroove.com/reference/customers-create
  try {
    return $.response[200].json($.context.store.createCustomer($.body));
  } catch (error) {
    if (error instanceof DomainError) {
      return $.response[400].json({ detail: error.message });
    }
    throw error;
  }
};

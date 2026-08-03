import type { paymentsList } from "../types/paths/payments.types.js";

export const GET: paymentsList = async ($) => {
  const payments =
    $.query.customer === undefined
      ? $.context.state.payments
      : $.context.state.payments.filter(
          (entry) => entry.customer === $.query.customer,
        );

  return $.response[200].json(
    $.context.paginate(payments, {
      headers: $.headers,
      path: "/payments/",
      query: $.query,
    }),
  );
};

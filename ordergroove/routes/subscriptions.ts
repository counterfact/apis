import type { subscriptionsList } from "../types/paths/subscriptions.types.js";
import { paginate } from "../domain/pagination.js";

export const GET: subscriptionsList = async ($) => {
  let subscriptions = $.context.state.subscriptions;
  if ($.query.customer !== undefined) {
    subscriptions = subscriptions.filter(
      (entry) => entry.customer === $.query.customer,
    );
  }
  if ($.query.product !== undefined) {
    subscriptions = subscriptions.filter(
      (entry) => entry.product === $.query.product,
    );
  }
  if ($.query.shipping_address !== undefined) {
    subscriptions = subscriptions.filter(
      (entry) => entry.shipping_address === $.query.shipping_address,
    );
  }
  if ($.query.live !== undefined) {
    subscriptions = subscriptions.filter((entry) =>
      $.query.live?.includes(entry.live),
    );
  }

  return $.response[200].json(
    paginate(subscriptions, {
      headers: $.headers,
      path: "/subscriptions/",
      query: $.query,
    }),
  );
};

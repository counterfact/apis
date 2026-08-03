import type { subscriptionsChangeShippingAddress } from "../../../types/paths/subscriptions/{subscription_id}/change_shipping.types.js";

export const PATCH: subscriptionsChangeShippingAddress = async ($) => {
  const subscription = $.context.state.subscriptions.find(
    (entry) => entry.public_id === $.path.subscription_id,
  );
  if (!subscription) {
    return $.response[404].json({ detail: "Unable to find requested asset." });
  }
  const address = $.context.state.addresses.find(
    (entry) => entry.public_id === $.body.shipping_address,
  );
  if (!address || !address.live || address.customer !== subscription.customer) {
    return $.response[400].json({ detail: "Invalid shipping address." });
  }

  subscription.shipping_address = address.public_id;
  return $.response[200].json(subscription);
};

import type { listOfferProfiles } from "../types/paths/offer_profiles.types.js";

export const GET: listOfferProfiles = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  return $.response[200].json({ results: $.context.listOfferProfiles() });
};

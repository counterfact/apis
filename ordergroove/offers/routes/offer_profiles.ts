import type { listOfferProfiles } from "../types/paths/offer_profiles.types.js";

// https://developer.ordergroove.com/reference/offer-profile-list
// OpenAPI does not declare the public reference's category and status filters.
export const GET: listOfferProfiles = async ($) => {
  return $.response[200].json({ results: $.context.listOfferProfiles() });
};

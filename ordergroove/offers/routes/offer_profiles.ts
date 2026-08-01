import type { listOfferProfiles } from "../types/paths/offer_profiles.types.js";

export const GET: listOfferProfiles = async ($) => {
  return $.response[200].json({ results: $.context.listOfferProfiles() });
};

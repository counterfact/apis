import type { orgsGetImmutableReleasesSettings } from "../../../../types/paths/orgs/{org}/settings/immutable-releases.types.js";
import type { orgsSetImmutableReleasesSettings } from "../../../../types/paths/orgs/{org}/settings/immutable-releases.types.js";

export const GET: orgsGetImmutableReleasesSettings = async ($) => {
  return $.response[200].random();
};

export const PUT: orgsSetImmutableReleasesSettings = async ($) => {
  return $.response[204].empty();
};

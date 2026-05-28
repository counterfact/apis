import type { orgsGetImmutableReleasesSettingsRepositories } from "../../../../../types/paths/orgs/{org}/settings/immutable-releases/repositories.types.js";
import type { orgsSetImmutableReleasesSettingsRepositories } from "../../../../../types/paths/orgs/{org}/settings/immutable-releases/repositories.types.js";

export const GET: orgsGetImmutableReleasesSettingsRepositories = async ($) => {
  return $.response[200].random();
};

export const PUT: orgsSetImmutableReleasesSettingsRepositories = async ($) => {
  return $.response[204].empty();
};

import type { orgsEnableSelectedRepositoryImmutableReleasesOrganization } from "../../../../../../types/paths/orgs/{org}/settings/immutable-releases/repositories/{repository_id}.types.js";
import type { orgsDisableSelectedRepositoryImmutableReleasesOrganization } from "../../../../../../types/paths/orgs/{org}/settings/immutable-releases/repositories/{repository_id}.types.js";

export const PUT: orgsEnableSelectedRepositoryImmutableReleasesOrganization =
  async ($) => {
    return $.response[204].empty();
  };

export const DELETE: orgsDisableSelectedRepositoryImmutableReleasesOrganization =
  async ($) => {
    return $.response[204].empty();
  };

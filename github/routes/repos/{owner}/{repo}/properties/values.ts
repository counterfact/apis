import type { reposCustomPropertiesForReposGetRepositoryValues } from "../../../../../types/paths/repos/{owner}/{repo}/properties/values.types.js";
import type { reposCustomPropertiesForReposCreateOrUpdateRepositoryValues } from "../../../../../types/paths/repos/{owner}/{repo}/properties/values.types.js";

export const GET: reposCustomPropertiesForReposGetRepositoryValues = async (
  $,
) => {
  return $.response[200].random();
};

export const PATCH: reposCustomPropertiesForReposCreateOrUpdateRepositoryValues =
  async ($) => {
    return $.response[204].empty();
  };

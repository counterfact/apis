import type { reposCheckImmutableReleases } from "../../../../types/paths/repos/{owner}/{repo}/immutable-releases.types.js";
import type { reposEnableImmutableReleases } from "../../../../types/paths/repos/{owner}/{repo}/immutable-releases.types.js";
import type { reposDisableImmutableReleases } from "../../../../types/paths/repos/{owner}/{repo}/immutable-releases.types.js";

export const GET: reposCheckImmutableReleases = async ($) => {
  return $.response[200].random();
};

export const PUT: reposEnableImmutableReleases = async ($) => {
  return $.response[204].empty();
};

export const DELETE: reposDisableImmutableReleases = async ($) => {
  return $.response[204].empty();
};

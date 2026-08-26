import type { getReleaseByFlagKey } from "../../../../../../types/paths/api/v2/flags/{projectKey}/{flagKey}/release.types.js";
import type { patchReleaseByFlagKey } from "../../../../../../types/paths/api/v2/flags/{projectKey}/{flagKey}/release.types.js";

export const GET: getReleaseByFlagKey = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchReleaseByFlagKey = async ($) => {
  return $.response[200].random();
};

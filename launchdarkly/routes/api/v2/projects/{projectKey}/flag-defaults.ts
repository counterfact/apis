import type { getFlagDefaultsByProject } from "../../../../../types/paths/api/v2/projects/{projectKey}/flag-defaults.types.js";
import type { patchFlagDefaultsByProject } from "../../../../../types/paths/api/v2/projects/{projectKey}/flag-defaults.types.js";
import type { putFlagDefaultsByProject } from "../../../../../types/paths/api/v2/projects/{projectKey}/flag-defaults.types.js";

export const GET: getFlagDefaultsByProject = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchFlagDefaultsByProject = async ($) => {
  return $.response[200].random();
};

export const PUT: putFlagDefaultsByProject = async ($) => {
  return $.response[200].random();
};

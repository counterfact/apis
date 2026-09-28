import type { getExperimentationSettings } from "../../../../../types/paths/api/v2/projects/{projectKey}/experimentation-settings.types.js";
import type { putExperimentationSettings } from "../../../../../types/paths/api/v2/projects/{projectKey}/experimentation-settings.types.js";

export const GET: getExperimentationSettings = async ($) => {
  return $.response[200].random();
};

export const PUT: putExperimentationSettings = async ($) => {
  return $.response[200].random();
};

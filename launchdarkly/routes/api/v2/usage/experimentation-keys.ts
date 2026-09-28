import type { getExperimentationKeysUsage } from "../../../../types/paths/api/v2/usage/experimentation-keys.types.js";

export const GET: getExperimentationKeysUsage = async ($) => {
  return $.response[200].random();
};

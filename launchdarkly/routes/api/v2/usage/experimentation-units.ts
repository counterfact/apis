import type { getExperimentationUnitsUsage } from "../../../../types/paths/api/v2/usage/experimentation-units.types.js";

export const GET: getExperimentationUnitsUsage = async ($) => {
  return $.response[200].random();
};

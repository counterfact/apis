import type { getFeatureFlagStatusAcrossEnvironments } from "../../../../../types/paths/api/v2/flag-status/{projectKey}/{featureFlagKey}.types.js";
import { respondJson } from "../../_.helpers.js";

export const GET: getFeatureFlagStatusAcrossEnvironments = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.getFlagStatusesAcrossEnvironments(
      $.path.projectKey,
      $.path.featureFlagKey,
    ),
  )) as never;
};

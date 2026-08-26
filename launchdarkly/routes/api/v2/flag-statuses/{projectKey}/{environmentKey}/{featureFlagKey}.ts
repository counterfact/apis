import type { getFeatureFlagStatus } from "../../../../../../types/paths/api/v2/flag-statuses/{projectKey}/{environmentKey}/{featureFlagKey}.types.js";
import { respondJson } from "../../../_.helpers.js";

export const GET: getFeatureFlagStatus = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.getFlagStatus(
      $.path.projectKey,
      $.path.environmentKey,
      $.path.featureFlagKey,
    ),
  )) as never;
};

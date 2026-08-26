import type { getFeatureFlagStatuses } from "../../../../../types/paths/api/v2/flag-statuses/{projectKey}/{environmentKey}.types.js";
import { collection, respondJson } from "../../_.helpers.js";

export const GET: getFeatureFlagStatuses = async ($) => {
  return (await respondJson($, 200, () =>
    collection(
      $.context.listFlagStatuses($.path.projectKey, $.path.environmentKey),
      `/api/v2/flag-statuses/${$.path.projectKey}/${$.path.environmentKey}`,
    ),
  )) as never;
};

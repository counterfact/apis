import type { getFeatureFlags } from "../../../../types/paths/api/v2/flags/{projectKey}.types.js";
import type { postFeatureFlag } from "../../../../types/paths/api/v2/flags/{projectKey}.types.js";
import { collection, respondJson } from "../_.helpers.js";

export const GET: getFeatureFlags = async ($) => {
  return (await respondJson($, 200, () =>
    collection(
      $.context.listFlags($.path.projectKey),
      `/api/v2/flags/${$.path.projectKey}`,
    ),
  )) as never;
};

export const POST: postFeatureFlag = async ($) => {
  return (await respondJson($, 201, () =>
    $.context.createFlag($.path.projectKey, $.body),
  )) as never;
};

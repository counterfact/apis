import type { getFeatureFlag } from "../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}.types.js";
import type { patchFeatureFlag } from "../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}.types.js";
import type { deleteFeatureFlag } from "../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}.types.js";
import { contentType, respondEmpty, respondJson } from "../../_.helpers.js";
import type { FeatureFlagPatchInput } from "../../../../_.context.js";

export const GET: getFeatureFlag = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.getFlag($.path.projectKey, $.path.featureFlagKey),
  )) as never;
};

export const PATCH: patchFeatureFlag = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.patchFlag(
      $.path.projectKey,
      $.path.featureFlagKey,
      $.body as unknown as FeatureFlagPatchInput,
      {
        dryRun: ($ as unknown as { query?: { dryRun?: boolean } }).query
          ?.dryRun,
        contentType: contentType($.headers as Record<string, unknown>),
      },
    ),
  )) as never;
};

export const DELETE: deleteFeatureFlag = async ($) => {
  return (await respondEmpty($, () =>
    $.context.deleteFlag($.path.projectKey, $.path.featureFlagKey),
  )) as never;
};

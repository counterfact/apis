import type { getSegment } from "../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}.types.js";
import type { patchSegment } from "../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}.types.js";
import type { deleteSegment } from "../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}.types.js";
import { respondEmpty, respondJson } from "../../../_.helpers.js";

export const GET: getSegment = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.getSegment(
      $.path.projectKey,
      $.path.environmentKey,
      $.path.segmentKey,
    ),
  )) as never;
};

export const PATCH: patchSegment = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.patchSegment(
      $.path.projectKey,
      $.path.environmentKey,
      $.path.segmentKey,
      $.body,
    ),
  )) as never;
};

export const DELETE: deleteSegment = async ($) => {
  return (await respondEmpty($, () =>
    $.context.deleteSegment(
      $.path.projectKey,
      $.path.environmentKey,
      $.path.segmentKey,
    ),
  )) as never;
};

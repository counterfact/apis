import type { getSegments } from "../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}.types.js";
import type { postSegment } from "../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}.types.js";
import { collection, respondJson } from "../../_.helpers.js";

export const GET: getSegments = async ($) => {
  return (await respondJson($, 200, () =>
    collection(
      $.context.listSegments($.path.projectKey, $.path.environmentKey),
      `/api/v2/segments/${$.path.projectKey}/${$.path.environmentKey}`,
    ),
  )) as never;
};

export const POST: postSegment = async ($) => {
  return (await respondJson($, 201, () =>
    $.context.createSegment($.path.projectKey, $.path.environmentKey, $.body),
  )) as never;
};

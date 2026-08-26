import type { getEnvironment } from "../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}.types.js";
import type { patchEnvironment } from "../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}.types.js";
import type { deleteEnvironment } from "../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}.types.js";
import { respondEmpty, respondJson } from "../../../_.helpers.js";

export const GET: getEnvironment = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.getEnvironment($.path.projectKey, $.path.environmentKey),
  )) as never;
};

export const PATCH: patchEnvironment = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.patchEnvironment(
      $.path.projectKey,
      $.path.environmentKey,
      $.body,
    ),
  )) as never;
};

export const DELETE: deleteEnvironment = async ($) => {
  return (await respondEmpty($, () =>
    $.context.deleteEnvironment($.path.projectKey, $.path.environmentKey),
  )) as never;
};

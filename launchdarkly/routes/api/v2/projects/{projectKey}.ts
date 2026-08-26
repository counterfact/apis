import type { getProject } from "../../../../types/paths/api/v2/projects/{projectKey}.types.js";
import type { patchProject } from "../../../../types/paths/api/v2/projects/{projectKey}.types.js";
import type { deleteProject } from "../../../../types/paths/api/v2/projects/{projectKey}.types.js";
import { respondEmpty, respondJson } from "../_.helpers.js";

export const GET: getProject = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.getProject($.path.projectKey),
  )) as never;
};

export const PATCH: patchProject = async ($) => {
  return (await respondJson($, 200, () =>
    $.context.patchProject($.path.projectKey, $.body),
  )) as never;
};

export const DELETE: deleteProject = async ($) => {
  return (await respondEmpty($, () =>
    $.context.deleteProject($.path.projectKey),
  )) as never;
};

import type { getEnvironmentsByProject } from "../../../../../types/paths/api/v2/projects/{projectKey}/environments.types.js";
import type { postEnvironment } from "../../../../../types/paths/api/v2/projects/{projectKey}/environments.types.js";
import { collection, respondJson } from "../../_.helpers.js";

export const GET: getEnvironmentsByProject = async ($) => {
  return (await respondJson($, 200, () =>
    collection(
      $.context.listEnvironments($.path.projectKey),
      `/api/v2/projects/${$.path.projectKey}/environments`,
    ),
  )) as never;
};

export const POST: postEnvironment = async ($) => {
  return (await respondJson($, 201, () =>
    $.context.createEnvironment($.path.projectKey, $.body),
  )) as never;
};

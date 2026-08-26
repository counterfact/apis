import type { getProjects } from "../../../types/paths/api/v2/projects.types.js";
import type { postProject } from "../../../types/paths/api/v2/projects.types.js";
import { collection, respondJson } from "./_.helpers.js";

export const GET: getProjects = async ($) => {
  return (await respondJson($, 200, () =>
    collection($.context.listProjects(), "/api/v2/projects"),
  )) as never;
};

export const POST: postProject = async ($) => {
  return (await respondJson($, 201, () =>
    $.context.createProject($.body),
  )) as never;
};

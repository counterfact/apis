import type { getAllReleasePipelines } from "../../../../../types/paths/api/v2/projects/{projectKey}/release-pipelines.types.js";
import type { postReleasePipeline } from "../../../../../types/paths/api/v2/projects/{projectKey}/release-pipelines.types.js";

export const GET: getAllReleasePipelines = async ($) => {
  return $.response[200].random();
};

export const POST: postReleasePipeline = async ($) => {
  return $.response[201].random();
};

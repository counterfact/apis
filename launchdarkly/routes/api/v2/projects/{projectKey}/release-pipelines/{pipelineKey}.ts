import type { getReleasePipelineByKey } from "../../../../../../types/paths/api/v2/projects/{projectKey}/release-pipelines/{pipelineKey}.types.js";
import type { patchReleasePipeline } from "../../../../../../types/paths/api/v2/projects/{projectKey}/release-pipelines/{pipelineKey}.types.js";
import type { deleteReleasePipeline } from "../../../../../../types/paths/api/v2/projects/{projectKey}/release-pipelines/{pipelineKey}.types.js";

export const GET: getReleasePipelineByKey = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchReleasePipeline = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteReleasePipeline = async ($) => {
  return $.response[204].empty();
};

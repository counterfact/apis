import type { deleteRepositoryProject } from "../../../../../../../types/paths/api/v2/engineering-insights/repositories/{repositoryKey}/projects/{projectKey}.types.js";

export const DELETE: deleteRepositoryProject = async ($) => {
  return $.response[204].empty();
};

import type { actionsGetCustomImageVersionForOrg } from "../../../../../../../../../types/paths/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}.types.js";
import type { actionsDeleteCustomImageVersionFromOrg } from "../../../../../../../../../types/paths/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}.types.js";

export const GET: actionsGetCustomImageVersionForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: actionsDeleteCustomImageVersionFromOrg = async ($) => {
  return $.response[204].empty();
};

import type { actionsListCustomImageVersionsForOrg } from "../../../../../../../../types/paths/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions.types.js";

export const GET: actionsListCustomImageVersionsForOrg = async ($) => {
  return $.response[200].random();
};

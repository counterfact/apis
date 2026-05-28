import type { actionsGetCustomImageForOrg } from "../../../../../../../types/paths/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}.types.js";
import type { actionsDeleteCustomImageFromOrg } from "../../../../../../../types/paths/orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}.types.js";

export const GET: actionsGetCustomImageForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: actionsDeleteCustomImageFromOrg = async ($) => {
  return $.response[204].empty();
};

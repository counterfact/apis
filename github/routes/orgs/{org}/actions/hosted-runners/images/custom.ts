import type { actionsListCustomImagesForOrg } from "../../../../../../types/paths/orgs/{org}/actions/hosted-runners/images/custom.types.js";

export const GET: actionsListCustomImagesForOrg = async ($) => {
  return $.response[200].random();
};

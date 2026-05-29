import type { actionsGetHostedRunnersGithubOwnedImagesForOrg } from "../../../../../../types/paths/orgs/{org}/actions/hosted-runners/images/github-owned.types.js";

export const GET: actionsGetHostedRunnersGithubOwnedImagesForOrg = async (
  $,
) => {
  return $.response[200].random();
};

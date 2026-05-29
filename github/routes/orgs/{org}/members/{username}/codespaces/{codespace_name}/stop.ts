import type { codespacesStopInOrganization } from "../../../../../../../types/paths/orgs/{org}/members/{username}/codespaces/{codespace_name}/stop.types.js";

export const POST: codespacesStopInOrganization = async ($) => {
  return $.response[200].random();
};

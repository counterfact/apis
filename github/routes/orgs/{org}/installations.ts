import type { orgsListAppInstallations } from "../../../types/paths/orgs/{org}/installations.types.js";

export const GET: orgsListAppInstallations = async ($) => {
  return $.response[200].random();
};

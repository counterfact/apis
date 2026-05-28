import type { packagesListPackagesForUser } from "../../../types/paths/users/{username}/packages.types.js";

export const GET: packagesListPackagesForUser = async ($) => {
  return $.response[200].random();
};

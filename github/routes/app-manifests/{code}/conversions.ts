import type { appsCreateFromManifest } from "../../../types/paths/app-manifests/{code}/conversions.types.js";

export const POST: appsCreateFromManifest = async ($) => {
  return $.response[201].random();
};

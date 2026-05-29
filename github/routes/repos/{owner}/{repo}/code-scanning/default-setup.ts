import type { codeScanningGetDefaultSetup } from "../../../../../types/paths/repos/{owner}/{repo}/code-scanning/default-setup.types.js";
import type { codeScanningUpdateDefaultSetup } from "../../../../../types/paths/repos/{owner}/{repo}/code-scanning/default-setup.types.js";

export const GET: codeScanningGetDefaultSetup = async ($) => {
  return $.response[200].random();
};

export const PATCH: codeScanningUpdateDefaultSetup = async ($) => {
  return $.response[200].random();
};

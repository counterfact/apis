import type { codeQualityGetSetup } from "../../../../../types/paths/repos/{owner}/{repo}/code-quality/setup.types.js";
import type { codeQualityUpdateSetup } from "../../../../../types/paths/repos/{owner}/{repo}/code-quality/setup.types.js";

export const GET: codeQualityGetSetup = async ($) => {
  return $.response[200].random();
};

export const PATCH: codeQualityUpdateSetup = async ($) => {
  return $.response[200].random();
};

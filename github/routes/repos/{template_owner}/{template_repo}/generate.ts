import type { reposCreateUsingTemplate } from "../../../../types/paths/repos/{template_owner}/{template_repo}/generate.types.js";

export const POST: reposCreateUsingTemplate = async ($) => {
  return $.response[201].random();
};

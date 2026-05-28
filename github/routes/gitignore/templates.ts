import type { gitignoreGetAllTemplates } from "../../types/paths/gitignore/templates.types.js";

export const GET: gitignoreGetAllTemplates = async ($) => {
  return $.response[200].random();
};

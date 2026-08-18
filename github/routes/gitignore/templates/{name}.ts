import type { gitignoreGetTemplate } from "../../../types/paths/gitignore/templates/{name}.types.js";

export const GET: gitignoreGetTemplate = async ($) => {
  const template = $.context.getGitignoreTemplate($.path.name);
  return template ? $.response[200].json(template) : $.response[404].empty();
};

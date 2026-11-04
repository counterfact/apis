import type { gitignoreGetTemplate } from "../../../types/paths/gitignore/templates/{name}.types.js";
import { notFound } from "../../not-found.js";

export const GET: gitignoreGetTemplate = async ($) => {
  const template = $.context.getGitignoreTemplate($.path.name);
  return template ? $.response[200].json(template) : notFound($.response);
};

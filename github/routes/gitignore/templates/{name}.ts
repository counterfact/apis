import type { gitignoreGetTemplate } from "../../../types/paths/gitignore/templates/{name}.types.js";

export const GET: gitignoreGetTemplate = async ($) => {
  return $.response[200].random();
};

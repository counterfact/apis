import type { deleteWorkflowTemplate } from "../../../../types/paths/api/v2/templates/{templateKey}.types.js";

export const DELETE: deleteWorkflowTemplate = async ($) => {
  return $.response[204].empty();
};

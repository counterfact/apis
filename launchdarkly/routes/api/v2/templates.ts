import type { getWorkflowTemplates } from "../../../types/paths/api/v2/templates.types.js";
import type { createWorkflowTemplate } from "../../../types/paths/api/v2/templates.types.js";

export const GET: getWorkflowTemplates = async ($) => {
  return $.response[200].random();
};

export const POST: createWorkflowTemplate = async ($) => {
  return $.response[201].random();
};

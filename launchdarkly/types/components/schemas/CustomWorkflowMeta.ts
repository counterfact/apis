import type { CustomWorkflowStageMeta } from "./CustomWorkflowStageMeta.js";

export type CustomWorkflowMeta = {
  /**
   * The name of the workflow stage that required this approval request
   * @example "Example workflow name"
   */
  name?: string;
  /**
   * Details on the stage of the workflow where this approval request is required
   */
  stage?: CustomWorkflowStageMeta;
};

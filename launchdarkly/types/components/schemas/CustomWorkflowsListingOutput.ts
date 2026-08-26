import type { CustomWorkflowOutput } from "./CustomWorkflowOutput.js";

export type CustomWorkflowsListingOutput = {
  /**
   * An array of workflows
   */
  items: Array<CustomWorkflowOutput>;
  /**
   * Total number of workflows
   * @example 1
   */
  totalCount: number;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};

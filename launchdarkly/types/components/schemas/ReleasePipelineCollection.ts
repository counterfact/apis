import type { ReleasePipeline } from "./ReleasePipeline.js";

export type ReleasePipelineCollection = {
  /**
   * An array of release pipelines
   */
  items: Array<ReleasePipeline>;
  /**
   * Total number of release pipelines
   * @example 1
   */
  totalCount: number;
};

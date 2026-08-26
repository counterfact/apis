import type { ReleasePhase } from "./ReleasePhase.js";

export type Release = {
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * The release pipeline name
   * @example "Example release pipeline"
   */
  name: string;
  /**
   * The release pipeline key
   * @example "example-release-pipeline"
   */
  releasePipelineKey: string;
  /**
   * The release pipeline description
   * @example "Our release pipeline for typical testing and deployment"
   */
  releasePipelineDescription: string;
  /**
   * An ordered list of the release pipeline phases
   */
  phases: Array<ReleasePhase>;
  /**
   * The release version
   * @example 1
   */
  _version: number;
};

import type { Phase } from "./Phase.js";
import type { Access } from "./Access.js";

export type ReleasePipeline = {
  /**
   * Timestamp of when the release pipeline was created
   * @format date-time
   * @example "1684262711507"
   */
  createdAt: string;
  /**
   * The release pipeline description
   * @example "Standard pipeline to roll out to production"
   */
  description?: string;
  /**
   * The release pipeline key
   * @example "standard-pipeline"
   */
  key: string;
  /**
   * The release pipeline name
   * @example "Standard Pipeline"
   */
  name: string;
  /**
   * An ordered list of the release pipeline phases. Each phase is a logical grouping of one or more environments that share attributes for rolling out changes.
   */
  phases: Array<Phase>;
  /**
   * A list of the release pipeline's tags
   * @example ["example-tag"]
   */
  tags?: Array<string>;
  /**
   * The release pipeline version
   * @example 1
   */
  _version?: number;
  /**
   * Details on the allowed and denied actions for this release pipeline
   */
  _access?: Access;
};

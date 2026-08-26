import type { CreatePhaseInput } from "./CreatePhaseInput.js";

export type CreateReleasePipelineInput = {
  /**
   * The release pipeline description
   * @example "Standard pipeline to roll out to production"
   */
  description?: string;
  /**
   * The unique identifier of this release pipeline
   * @example "standard-pipeline"
   */
  key: string;
  /**
   * The name of the release pipeline
   * @example "Standard Pipeline"
   */
  name: string;
  /**
   * A logical grouping of one or more environments that share attributes for rolling out changes
   */
  phases: Array<CreatePhaseInput>;
  /**
   * A list of tags for this release pipeline
   * @example ["example-tag"]
   */
  tags?: Array<string>;
};

import type { ObjectId } from "./ObjectId.js";
import type { StageInput } from "./StageInput.js";

export type CustomWorkflowInput = {
  /**
   * The ID of the workflow maintainer. Defaults to the workflow creator.
   * @example "12ab3c45de678910abc12345"
   */
  maintainerId?: ObjectId;
  /**
   * The workflow name
   * @example "Progressive rollout starting in two days"
   */
  name: string;
  /**
   * The workflow description
   * @example "Turn flag on for 10% of users each day"
   */
  description?: string;
  /**
   * A list of the workflow stages
   */
  stages?: Array<StageInput>;
  /**
   * The template key
   */
  templateKey?: string;
};

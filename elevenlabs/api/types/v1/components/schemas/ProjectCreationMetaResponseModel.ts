import type { ProjectCreationMetaType } from "./ProjectCreationMetaType.js";
/**
 * @example {"creation_progress":0.5,"status":"pending","type":"blank"}
 */
export type ProjectCreationMetaResponseModel = {
  /**
   * The progress of the project creation.
   */
  creation_progress: number;
  /**
   * The status of the project creation action.
   */
  status: "draft" | "pending" | "creating" | "finished" | "failed";
  /**
   * The type of the project creation action.
   */
  type: ProjectCreationMetaType;
};

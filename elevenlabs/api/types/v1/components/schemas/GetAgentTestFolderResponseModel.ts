import type { AgentTestFolderPathSegmentResponseModel } from "./AgentTestFolderPathSegmentResponseModel.js";
export type GetAgentTestFolderResponseModel = {
  id: string;
  name: string;
  /**
   * The path from the root folder to the current folder.
   */
  folder_path?: Array<AgentTestFolderPathSegmentResponseModel>;
  /**
   * The number of direct children (tests and subfolders) in this folder
   * @default 0
   */
  children_count?: number;
};

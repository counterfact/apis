import type { WorkspaceGroupResponseModel } from "./WorkspaceGroupResponseModel.js";
export type DefaultSharingGroupResponseModel = {
  /**
   * The group to share with by default
   */
  group: WorkspaceGroupResponseModel;
  /**
   * The permission level to grant to the group
   */
  permission_level: "admin" | "editor" | "viewer";
};

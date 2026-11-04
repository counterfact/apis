export type DefaultSharingGroupConfig = {
  /**
   * The ID of the group to share with
   */
  group_id: string;
  /**
   * The permission level to grant to the group
   */
  permission_level: "admin" | "editor" | "viewer";
};

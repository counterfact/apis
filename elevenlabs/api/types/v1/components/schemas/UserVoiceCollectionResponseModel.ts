export type UserVoiceCollectionResponseModel = {
  /**
   * The ID of the voice collection.
   */
  collection_id: string;
  /**
   * The title of the voice collection.
   */
  title: string;
  /**
   * The icon of the voice collection.
   */
  icon: string;
  /**
   * The caller's access role on the voice collection.
   */
  permission_on_resource: "admin" | "editor" | "commenter" | "viewer";
};

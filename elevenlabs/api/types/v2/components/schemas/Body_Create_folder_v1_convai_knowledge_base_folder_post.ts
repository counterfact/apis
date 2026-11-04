export type Body_Create_folder_v1_convai_knowledge_base_folder_post = {
  /**
   * A custom, human-readable name for the document.
   */
  name: string;
  /**
   * If set, the created document or folder will be placed inside the given folder.
   */
  parent_folder_id?: string | null;
  /**
   * Whether to enable auto-sync for this URL document.
   * @default false
   */
  enable_auto_sync?: boolean;
  /**
   * Whether to automatically remove the document if the URL becomes unavailable. Only applicable when auto-sync is enabled.
   * @default false
   */
  auto_remove?: boolean;
  /**
   * Minimum frequency (in days) at which the underlying eligible documents are refreshed. The actual interval may be shorter, never longer. Defaults to 7, tightened to the parent folder's frequency if that is stricter. Only applicable when auto-sync is enabled.
   */
  minimum_frequency_days?: number | null;
};

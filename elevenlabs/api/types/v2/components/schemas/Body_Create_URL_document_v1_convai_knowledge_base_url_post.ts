export type Body_Create_URL_document_v1_convai_knowledge_base_url_post = {
  /**
   * URL to a page of documentation that the agent will have access to in order to interact with users.
   */
  url: string;
  /**
   * A custom, human-readable name for the document.
   */
  name?: string | null;
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
   * Minimum frequency (in days) at which the document is refreshed. The actual interval may be shorter, never longer. Defaults to 7, tightened to the parent folder's frequency if that is stricter. Only applicable when auto-sync is enabled.
   */
  minimum_frequency_days?: number | null;
};

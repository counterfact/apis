export type Body_Create_file_document_v1_convai_knowledge_base_file_post = {
  /**
   * Documentation that the agent will have access to in order to interact with users.
   * @format binary
   */
  file: Uint8Array | string;
  /**
   * A custom, human-readable name for the document.
   */
  name?: string | null;
  /**
   * If set, the created document or folder will be placed inside the given folder.
   */
  parent_folder_id?: string | null;
};

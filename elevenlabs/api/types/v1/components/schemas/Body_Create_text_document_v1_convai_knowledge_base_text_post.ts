export type Body_Create_text_document_v1_convai_knowledge_base_text_post = {
  /**
   * Text content to be added to the knowledge base.
   */
  text: string;
  /**
   * A custom, human-readable name for the document.
   */
  name?: string | null;
  /**
   * If set, the created document or folder will be placed inside the given folder.
   */
  parent_folder_id?: string | null;
};

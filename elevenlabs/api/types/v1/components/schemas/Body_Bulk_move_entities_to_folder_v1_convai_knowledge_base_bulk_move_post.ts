export type Body_Bulk_move_entities_to_folder_v1_convai_knowledge_base_bulk_move_post =
  {
    /**
     * The ids of documents or folders from the knowledge base.
     */
    document_ids: Array<string>;
    /**
     * The folder to move the entities to. If not set, the entities will be moved to the root folder.
     */
    move_to?: string | null;
  };

export type Body_Bulk_delete_knowledge_base_documents_v1_convai_knowledge_base_bulk_delete_post =
  {
    /**
     * The ids of documents or folders from the knowledge base.
     */
    document_ids: Array<string>;
    /**
     * If set to true, documents or folders will be deleted regardless of whether they are used by any agents and will be removed from the dependent agents. For non-empty folders, this will also delete all child documents and folders.
     * @default false
     */
    force?: boolean;
  };

export type Body_Update_document_v1_convai_knowledge_base__documentation_id__patch =
  {
    /**
     * A custom, human-readable name for the document.
     */
    name?: string | null;
    /**
     * Updated content for the document. Only supported for text documents, URL documents with auto-sync disabled, and file documents that are not synced from an external source.
     */
    content?: string | null;
    /**
     * Whether the document or folder is refreshed automatically. Only applicable to URL documents, folders, and externally-synced files. Leave unset to keep the current value.
     */
    enable_auto_sync?: boolean | null;
    /**
     * Whether to automatically remove the document once its source is no longer available. Only applicable when auto-sync is enabled. Leave unset to keep the current value.
     */
    auto_remove?: boolean | null;
    /**
     * Minimum frequency (in days) at which the document is refreshed. The actual interval may be shorter, never longer. Only applicable when auto-sync is enabled. Leave unset to keep the current value.
     */
    minimum_frequency_days?: number | null;
    /**
     * Folders only. When true, items already in the folder are only tightened to stay at least as strict as the folder, and keep any setting that is stricter than the folder's. When false, they are set to exactly the folder's auto-sync settings. Ignored for externally synced folders, whose contents always follow the folder's schedule.
     * @default false
     */
    tighten_only?: boolean;
  };

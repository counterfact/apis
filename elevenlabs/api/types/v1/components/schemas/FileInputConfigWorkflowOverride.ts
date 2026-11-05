export type FileInputConfigWorkflowOverride = {
  /**
   * When enabled, users may attach images, PDFs, or text files in chat when the LLM supports multimodal input.
   */
  enabled?: boolean | null;
  /**
   * Number of most-recent files kept in memory during a conversation. Older files are summarized and their bytes freed.
   */
  max_files_in_memory?: number | null;
  /**
   * Total files a user can upload in one conversation. Uploads are billed per file. Use -1 for no limit, or a value >= max_files_in_memory.
   */
  max_files_per_conversation?: number | null;
};

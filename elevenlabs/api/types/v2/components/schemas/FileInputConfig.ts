export type FileInputConfig = {
  /**
   * When enabled, users may attach images, PDFs, or text files in chat when the LLM supports multimodal input.
   * @default true
   */
  enabled?: boolean;
  /**
   * Number of most-recent files kept in memory during a conversation. Older files are summarized and their bytes freed.
   * @default 10
   */
  max_files_in_memory?: number;
  /**
   * Total files a user can upload in one conversation. Uploads are billed per file. Use -1 for no limit, or a value >= max_files_in_memory.
   * @default 10
   */
  max_files_per_conversation?: number;
};

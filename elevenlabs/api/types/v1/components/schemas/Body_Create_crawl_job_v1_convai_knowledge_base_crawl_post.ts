export type Body_Create_crawl_job_v1_convai_knowledge_base_crawl_post = {
  /**
   * URL to a page of documentation that the agent will have access to in order to interact with users.
   */
  url: string;
  /**
   * Deprecated - this field is a no-op and will be removed in a future version.
   * @default 3
   * @deprecated
   */
  max_depth?: number;
  /**
   * Maximum number of pages to crawl (1-10,000), defaults to 1000.
   * @default 1000
   */
  max_pages?: number;
  /**
   * If set, only URLs that match this pattern are included.
   */
  pattern?: string | null;
  /**
   * If set, URLs that match any of these patterns are skipped, even if they match `pattern`.
   */
  exclude_patterns?: Array<string> | null;
  /**
   * List of URLs to crawl from sitemap (optional, overrides automatic URL discovery).
   */
  sitemap_urls?: Array<string> | null;
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
   * Automatically discover and add new pages linked from already-crawled pages during auto-sync. Requires enable_auto_sync=true.
   * @default false
   */
  auto_discover?: boolean;
  /**
   * Minimum frequency (in days) at which the underlying eligible documents are refreshed. The actual interval may be shorter, never longer. Defaults to 7, tightened to the parent folder's frequency if that is stricter. Only applicable when auto-sync is enabled.
   */
  minimum_frequency_days?: number | null;
};

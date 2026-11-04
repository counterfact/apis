import type { CrawlType } from "./CrawlType.js";
import type { CrawlStatus } from "./CrawlStatus.js";
export type GetCrawlJobResponseModel = {
  /**
   * @default "discovery"
   */
  type?: CrawlType;
  seed_url: string;
  pattern?: string | null;
  /**
   * URLs matching any of these patterns are skipped, even if they match `pattern`.
   */
  exclude_patterns?: Array<string>;
  max_pages: number;
  /**
   * Whether to automatically discover and enqueue additional pages found while crawling.
   * @default false
   */
  auto_discover?: boolean;
  /**
   * @default "queued"
   */
  status?: CrawlStatus;
  /**
   * @default 0
   */
  pages_identified?: number;
  /**
   * @default 0
   */
  pages_scraped?: number;
  /**
   * @default 0
   */
  pages_skipped?: number;
  /**
   * @default 0
   */
  pages_failed?: number;
  root_folder_id: string;
  updated_at: number;
  id: string;
  created_at: number;
};

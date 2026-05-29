import type { simple_commit_status } from "./simple-commit-status.js";
import type { minimal_repository } from "./minimal-repository.js";

/**
 * Combined Commit Status
 */
export type combined_commit_status = {
  state: string;
  statuses: Array<simple_commit_status>;
  sha: string;
  total_count: number;
  repository: minimal_repository;
  /**
   * @format uri
   */
  commit_url: string;
  /**
   * @format uri
   */
  url: string;
};

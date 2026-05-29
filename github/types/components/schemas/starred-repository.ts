import type { repository } from "./repository.js";

/**
 * Starred Repository
 */
export type starred_repository = {
  /**
   * @format date-time
   */
  starred_at: string;
  repo: repository;
};

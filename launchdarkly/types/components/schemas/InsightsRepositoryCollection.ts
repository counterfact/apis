import type { InsightsRepository } from "./InsightsRepository.js";

export type InsightsRepositoryCollection = {
  /**
   * Total number of repositories
   * @example 1
   */
  totalCount: number;
  /**
   * List of repositories
   */
  items: Array<InsightsRepository>;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};

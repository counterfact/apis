import type { InsightsRepositoryProject } from "./InsightsRepositoryProject.js";

export type InsightsRepositoryProjectCollection = {
  /**
   * Total number of repository project associations
   * @example 1
   */
  totalCount: number;
  /**
   * List of repository project associations
   */
  items: Array<InsightsRepositoryProject>;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};

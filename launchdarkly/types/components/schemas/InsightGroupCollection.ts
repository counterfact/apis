import type { InsightGroup } from "./InsightGroup.js";
import type { InsightGroupCollectionMetadata } from "./InsightGroupCollectionMetadata.js";
import type { InsightGroupCollectionScoreMetadata } from "./InsightGroupCollectionScoreMetadata.js";

export type InsightGroupCollection = {
  /**
   * The total number of insight groups
   * @example 15
   */
  totalCount: number;
  /**
   * A list of insight groups
   */
  items: Array<InsightGroup>;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * Metadata about the insight groups
   */
  metadata?: InsightGroupCollectionMetadata;
  /**
   * Metadata about the insight scores, when expanded
   */
  scoreMetadata?: InsightGroupCollectionScoreMetadata;
};

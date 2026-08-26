import type { Environment } from "./Environment.js";
import type { InsightGroupScores } from "./InsightGroupScores.js";
import type { InsightGroupCollectionScoreMetadata } from "./InsightGroupCollectionScoreMetadata.js";
import type { UnixMillis } from "./UnixMillis.js";

export type InsightGroup = {
  /**
   * Expanded details about the environment
   */
  environment?: Environment;
  /**
   * The scores for the insight group
   */
  scores?: InsightGroupScores;
  /**
   * Metadata about the insight scores, when expanded
   */
  scoreMetadata?: InsightGroupCollectionScoreMetadata;
  /**
   * The insight group key
   * @example "default-production-all-apps"
   */
  key: string;
  /**
   * The insight group name
   * @example "Production - All Apps"
   */
  name: string;
  /**
   * The project key
   * @example "default"
   */
  projectKey: string;
  /**
   * The environment key
   * @example "production"
   */
  environmentKey: string;
  /**
   * The application keys
   * @example ["billing-service","inventory-service"]
   */
  applicationKeys?: Array<string>;
  /**
   * The time the insight group was created
   * @example "1706701522000"
   */
  createdAt: UnixMillis;
};

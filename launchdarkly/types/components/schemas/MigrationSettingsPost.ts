import type { MigrationFlagStageCount } from "./MigrationFlagStageCount.js";

export type MigrationSettingsPost = {
  /**
   * Context kind for a migration with 6 stages, where data is being moved
   */
  contextKind?: string;
  stageCount: MigrationFlagStageCount;
};

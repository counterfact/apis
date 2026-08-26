export type FlagMigrationSettingsRep = {
  /**
   * The context kind targeted by this migration flag. Only applicable for six-stage migrations.
   * @example "device"
   */
  contextKind?: string;
  /**
   * The number of stages for this migration flag
   * @example 6
   */
  stageCount?: number;
};

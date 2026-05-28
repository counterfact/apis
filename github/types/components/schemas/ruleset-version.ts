/**
 * The historical version of a ruleset
 */
export type ruleset_version = {
  /**
   * The ID of the previous version of the ruleset
   */
  version_id: number;
  /**
   * The actor who updated the ruleset
   */
  actor: { id?: number; type?: string };
  /**
   * @format date-time
   */
  updated_at: string;
};

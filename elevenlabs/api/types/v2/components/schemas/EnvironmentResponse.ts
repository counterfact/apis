/**
 * @example {"created_by_user_id":"user_7k2m9x","name":"staging","updated_at_unix_secs":1714003600}
 */
export type EnvironmentResponse = {
  /**
   * Name of the environment, e.g. 'staging'.
   */
  name: string;
  /**
   * When the environment was created or one of its values last changed. Unset when neither is known.
   */
  updated_at_unix_secs?: number | null;
  /**
   * Unset for 'production' and when the creator is not known.
   */
  created_by_user_id?: string | null;
};

import type { EnvironmentResponse } from "./EnvironmentResponse.js";
/**
 * @example {"environments":[{"name":"production","updated_at_unix_secs":1714000000},{"created_by_user_id":"user_7k2m9x","name":"staging","updated_at_unix_secs":1714003600}]}
 */
export type EnvironmentsListResponse = {
  /**
   * All workspace environments, 'production' first. Variables without a value for an environment fall back to their production value.
   */
  environments: Array<EnvironmentResponse>;
};

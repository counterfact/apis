import type { interaction_group } from "./interaction-group.js";

/**
 * Interaction limit settings.
 */
export type interaction_limit_response = {
  limit: interaction_group;
  /**
   * @example "repository"
   */
  origin: string;
  /**
   * @format date-time
   * @example "2018-08-17T04:18:39Z"
   */
  expires_at: string;
};

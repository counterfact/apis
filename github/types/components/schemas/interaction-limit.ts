import type { interaction_group } from "./interaction-group.js";
import type { interaction_expiry } from "./interaction-expiry.js";

/**
 * Limit interactions to a specific type of user for a specified duration
 */
export type interaction_limit = {
  limit: interaction_group;
  expiry?: interaction_expiry;
};

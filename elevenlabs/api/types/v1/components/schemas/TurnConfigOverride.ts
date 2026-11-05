import type { SoftTimeoutConfigOverride } from "./SoftTimeoutConfigOverride.js";
/**
 * @example {"soft_timeout_config":{"message":"Hhmmmm...yeah."}}
 */
export type TurnConfigOverride = {
  /**
   * Configuration for soft timeout functionality. Provides immediate feedback during longer LLM responses.
   */
  soft_timeout_config?: SoftTimeoutConfigOverride | null;
  /**
   * What the agent says when it detects a noisy environment.
   */
  noisy_environment_message?: string | null;
};

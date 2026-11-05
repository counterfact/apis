import type { SoftTimeoutConfigOverrideConfig } from "./SoftTimeoutConfigOverrideConfig.js";
export type TurnConfigOverrideConfig = {
  /**
   * Configures overrides for nested fields.
   */
  soft_timeout_config?: SoftTimeoutConfigOverrideConfig;
  /**
   * Whether to allow overriding the noisy_environment_message field.
   * @default false
   */
  noisy_environment_message?: boolean;
};

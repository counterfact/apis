import type { PromptAgentAPIModelOverrideConfig } from "./PromptAgentAPIModelOverrideConfig.js";
export type AgentConfigOverrideConfig = {
  /**
   * Whether to allow overriding the first_message field.
   * @default false
   */
  first_message?: boolean;
  /**
   * Whether to allow overriding the language field.
   * @default false
   */
  language?: boolean;
  /**
   * Whether to allow overriding the max_conversation_duration_message field.
   * @default false
   */
  max_conversation_duration_message?: boolean;
  /**
   * Configures overrides for nested fields.
   */
  prompt?: PromptAgentAPIModelOverrideConfig;
};

import type { ASRConversationalConfigOverrideConfig } from "./ASRConversationalConfigOverrideConfig.js";
import type { TurnConfigOverrideConfig } from "./TurnConfigOverrideConfig.js";
import type { TTSConversationalConfigOverrideConfig } from "./TTSConversationalConfigOverrideConfig.js";
import type { ConversationConfigOverrideConfig } from "./ConversationConfigOverrideConfig.js";
import type { AgentConfigOverrideConfig } from "./AgentConfigOverrideConfig.js";
export type ConversationConfigClientOverrideConfig_Input = {
  /**
   * Configures overrides for nested fields.
   */
  asr?: ASRConversationalConfigOverrideConfig;
  /**
   * Configures overrides for nested fields.
   */
  turn?: TurnConfigOverrideConfig;
  /**
   * Configures overrides for nested fields.
   */
  tts?: TTSConversationalConfigOverrideConfig;
  /**
   * Configures overrides for nested fields.
   */
  conversation?: ConversationConfigOverrideConfig;
  /**
   * Configures overrides for nested fields.
   */
  agent?: AgentConfigOverrideConfig;
};

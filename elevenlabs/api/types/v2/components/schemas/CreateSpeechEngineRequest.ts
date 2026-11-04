import type { SpeechEngineConfig } from "./SpeechEngineConfig.js";
import type { ASRConversationalConfig } from "./ASRConversationalConfig.js";
import type { TTSConversationalConfig_Input } from "./TTSConversationalConfig-Input.js";
import type { BaseTurnConfig } from "./BaseTurnConfig.js";
import type { VADConfig } from "./VADConfig.js";
import type { ConversationConfig_Input } from "./ConversationConfig-Input.js";
import type { PrivacyConfig_Input } from "./PrivacyConfig-Input.js";
import type { AgentCallLimits } from "./AgentCallLimits.js";
import type { SpeechEngineAuthConfig } from "./SpeechEngineAuthConfig.js";
import type { SpeechEngineConversationInitiationClientDataConfig } from "./SpeechEngineConversationInitiationClientDataConfig.js";
export type CreateSpeechEngineRequest = {
  /**
   * Name of the speech engine
   * @default "Speech Engine"
   */
  name?: string;
  /**
   * Speech engine WebSocket configuration
   */
  speech_engine: SpeechEngineConfig;
  /**
   * ASR configuration
   */
  asr?: ASRConversationalConfig;
  /**
   * TTS configuration
   */
  tts?: TTSConversationalConfig_Input;
  /**
   * Turn detection configuration
   */
  turn?: BaseTurnConfig;
  /**
   * Configuration for voice activity detection
   */
  vad?: VADConfig;
  /**
   * Conversation configuration (client events, etc.)
   */
  conversation?: ConversationConfig_Input;
  /**
   * Privacy settings (recording, retention, zero retention mode)
   */
  privacy?: PrivacyConfig_Input;
  /**
   * Concurrency and daily conversation limits for this speech engine
   */
  call_limits?: AgentCallLimits;
  /**
   * Who may start a conversation with this speech engine
   */
  auth?: SpeechEngineAuthConfig;
  /**
   * Language for the speech engine
   * @default "en"
   */
  language?: string;
  /**
   * Time in seconds to wait for the upstream speech engine endpoint to respond before the attempt is abandoned and retried. Must be between 2 and 15 seconds.
   * @default 4
   */
  cascade_timeout_seconds?: number;
  /**
   * Tags for categorization
   */
  tags?: Array<string>;
  /**
   * Override settings the client may set during conversation initiation
   */
  overrides?: SpeechEngineConversationInitiationClientDataConfig;
};

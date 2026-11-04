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
export type UpdateSpeechEngineRequest = {
  name?: string | null;
  speech_engine?: SpeechEngineConfig | null;
  asr?: ASRConversationalConfig | null;
  tts?: TTSConversationalConfig_Input | null;
  turn?: BaseTurnConfig | null;
  vad?: VADConfig | null;
  conversation?: ConversationConfig_Input | null;
  privacy?: PrivacyConfig_Input | null;
  call_limits?: AgentCallLimits | null;
  /**
   * Who may start a conversation with this speech engine
   */
  auth?: SpeechEngineAuthConfig | null;
  language?: string | null;
  /**
   * Time in seconds to wait for the upstream speech engine endpoint to respond before the attempt is abandoned and retried. Must be between 2 and 15 seconds.
   */
  cascade_timeout_seconds?: number | null;
  tags?: Array<string> | null;
  overrides?: SpeechEngineConversationInitiationClientDataConfig | null;
};

import type { SpeechEngineConfig } from "./SpeechEngineConfig.js";
import type { ASRConversationalConfig } from "./ASRConversationalConfig.js";
import type { TTSConversationalConfig_Output } from "./TTSConversationalConfig-Output.js";
import type { BaseTurnConfig } from "./BaseTurnConfig.js";
import type { VADConfig } from "./VADConfig.js";
import type { ConversationConfig_Output } from "./ConversationConfig-Output.js";
import type { PrivacyConfig_Output } from "./PrivacyConfig-Output.js";
import type { AgentCallLimits } from "./AgentCallLimits.js";
import type { SpeechEngineAuthConfig } from "./SpeechEngineAuthConfig.js";
import type { SpeechEngineConversationInitiationClientDataConfig } from "./SpeechEngineConversationInitiationClientDataConfig.js";
import type { AgentMetadataDBModel } from "./AgentMetadataDBModel.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
/**
 * @example {"asr":{"keywords":[],"provider":"elevenlabs","quality":"high","user_input_audio_format":"pcm_16000"},"auth":{"enable_auth":false},"call_limits":{"agent_concurrency_limit":-1,"bursting_enabled":true,"daily_limit":100000},"cascade_timeout_seconds":4,"conversation":{"client_events":["audio","interruption","agent_response","user_transcript"],"max_duration_seconds":600},"language":"en","metadata":{"created_at_unix_secs":1714000000,"created_from":"api","last_updated_from":"api","updated_at_unix_secs":1714000000},"name":"My Speech Engine","overrides":{"first_message":false},"privacy":{"apply_to_existing_conversations":false,"delete_audio":false,"delete_transcript_and_pii":false,"record_voice":true,"retention_days":-1,"zero_retention_mode":false},"speech_engine":{"request_headers":{},"ws_url":"wss://example.com/transcript"},"speech_engine_id":"seng_3701k3ttaq12ewp8b7qv5rfyszkz","tags":["production","v1"],"tts":{"agent_output_audio_format":"pcm_16000","model_id":"eleven_flash_v2","optimize_streaming_latency":3,"similarity_boost":0.8,"speed":1,"stability":0.5,"voice_id":"cjVigY5qzO86Huf0OWal"},"turn":{"mode":"turn","silence_end_call_timeout":-1,"turn_eagerness":"normal","turn_timeout":7},"vad":{"background_voice_detection":false}}
 */
export type SpeechEngineResponse = {
  /**
   * The speech engine resource ID
   */
  speech_engine_id: string;
  /**
   * Human-readable name for the speech engine
   */
  name: string;
  /**
   * WebSocket connection settings for the upstream transcript server
   */
  speech_engine: SpeechEngineConfig;
  /**
   * Automatic speech recognition configuration
   */
  asr: ASRConversationalConfig;
  /**
   * Text-to-speech output configuration
   */
  tts: TTSConversationalConfig_Output;
  /**
   * Turn detection configuration
   */
  turn: BaseTurnConfig;
  /**
   * Configuration for voice activity detection
   */
  vad: VADConfig;
  /**
   * Conversation-level settings including client events and duration limits
   */
  conversation: ConversationConfig_Output;
  /**
   * Privacy settings controlling recording, retention, and PII handling
   */
  privacy: PrivacyConfig_Output;
  /**
   * Concurrency and daily conversation limits for this speech engine
   */
  call_limits: AgentCallLimits;
  /**
   * Who may start a conversation with this speech engine
   */
  auth: SpeechEngineAuthConfig;
  /**
   * ISO language code used by the speech engine (e.g. 'en')
   */
  language: string;
  /**
   * Time in seconds to wait for the upstream speech engine endpoint to respond before the attempt is abandoned and retried. Must be between 2 and 15 seconds.
   */
  cascade_timeout_seconds: number;
  /**
   * Arbitrary tags for categorization and filtering
   */
  tags: Array<string>;
  /**
   * Override settings the client may set during conversation initiation
   */
  overrides: SpeechEngineConversationInitiationClientDataConfig;
  /**
   * Creation and update timestamps with source information
   */
  metadata: AgentMetadataDBModel;
  /**
   * The access information of the speech engine for the user
   */
  access_info?: ResourceAccessInfo | null;
};

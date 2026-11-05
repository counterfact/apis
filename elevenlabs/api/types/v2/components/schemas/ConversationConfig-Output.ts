import type { ClientEvent } from "./ClientEvent.js";
import type { FileInputConfig } from "./FileInputConfig.js";
import type { DTMFInputConfig } from "./DTMFInputConfig.js";
import type { BackgroundSoundConfig } from "./BackgroundSoundConfig.js";
/**
 * @example {"client_events":["audio","interruption"],"max_duration_seconds":600}
 */
export type ConversationConfig_Output = {
  /**
   * If enabled audio will not be processed and only text will be used, use to avoid audio pricing.
   * @default false
   */
  text_only?: boolean;
  /**
   * The maximum duration of a conversation in seconds
   * @default 600
   */
  max_duration_seconds?: number;
  /**
   * The events that will be sent to the client
   */
  client_events?: Array<ClientEvent>;
  /**
   * Configuration for file input (image/PDF uploads) during conversations.
   */
  file_input?: FileInputConfig;
  /**
   * Enable real-time monitoring of conversations via WebSocket
   * @default false
   */
  monitoring_enabled?: boolean;
  /**
   * The events that will be sent to monitoring connections.
   */
  monitoring_events?: Array<ClientEvent>;
  /**
   * Configure DTMF (keypad) input collection during phone calls
   */
  dtmf_input_settings?: DTMFInputConfig | null;
  /**
   * Configuration for background sound during conversations.
   */
  background_sound?: BackgroundSoundConfig;
  /**
   * When enabled and knowledge base content is present, the LLM is instructed to report which sources it used.
   * @default false
   */
  source_attribution?: boolean;
};

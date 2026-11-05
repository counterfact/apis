import type { ClientEvent } from "./ClientEvent.js";
import type { FileInputConfigWorkflowOverride } from "./FileInputConfigWorkflowOverride.js";
import type { DTMFInputConfig } from "./DTMFInputConfig.js";
import type { BackgroundSoundConfigWorkflowOverride } from "./BackgroundSoundConfigWorkflowOverride.js";
/**
 * @example {"client_events":["audio","interruption"],"max_duration_seconds":600}
 */
export type ConversationConfigWorkflowOverride_Output = {
  /**
   * If enabled audio will not be processed and only text will be used, use to avoid audio pricing.
   */
  text_only?: boolean | null;
  /**
   * The maximum duration of a conversation in seconds
   */
  max_duration_seconds?: number | null;
  /**
   * The events that will be sent to the client
   */
  client_events?: Array<ClientEvent> | null;
  /**
   * Configuration for file input (image/PDF uploads) during conversations.
   */
  file_input?: FileInputConfigWorkflowOverride | null;
  /**
   * Enable real-time monitoring of conversations via WebSocket
   */
  monitoring_enabled?: boolean | null;
  /**
   * The events that will be sent to monitoring connections.
   */
  monitoring_events?: Array<ClientEvent> | null;
  /**
   * Configure DTMF (keypad) input collection during phone calls
   */
  dtmf_input_settings?: DTMFInputConfig | null;
  /**
   * Configuration for background sound during conversations.
   */
  background_sound?: BackgroundSoundConfigWorkflowOverride | null;
  /**
   * When enabled and knowledge base content is present, the LLM is instructed to report which sources it used.
   */
  source_attribution?: boolean | null;
};

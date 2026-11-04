import type { ConvAISecretLocator } from "./ConvAISecretLocator.js";
import type { ConvAIDynamicVariable } from "./ConvAIDynamicVariable.js";
export type SpeechEngineConfig = {
  /**
   * The WebSocket URL for the transcript server
   */
  ws_url: string;
  /**
   * Headers to include in the WebSocket connection request
   */
  request_headers?: {
    [key: string]: string | ConvAISecretLocator | ConvAIDynamicVariable;
  };
};

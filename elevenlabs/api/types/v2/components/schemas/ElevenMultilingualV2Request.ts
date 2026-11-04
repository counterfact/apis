import type { WebhookTarget } from "./WebhookTarget.js";
import type { PronunciationDictionaryVersionLocator } from "./PronunciationDictionaryVersionLocator.js";
import type { TtsVoiceSettings } from "./TtsVoiceSettings.js";
/**
 * Request body for the ElevenLabs Multilingual v2 TTS model.
 */
export type ElevenMultilingualV2Request = {
  /**
   * Include to send the generation's result to the workspace's configured flows webhooks once it completes or fails. The webhook payload matches the terminal response of the corresponding GET endpoint.
   */
  webhook?: WebhookTarget | null;
  /**
   * The text to synthesize into speech.
   */
  text: string;
  /**
   * The ID of the voice to speak with.
   */
  voice: string;
  /**
   * The audio encoding of the output, as `codec_sampleRateHz_bitrateKbps`. `mp3_44100_192` requires the Creator tier or above.
   * @default "mp3_44100_128"
   */
  output_format?:
    | "mp3_22050_32"
    | "mp3_24000_48"
    | "mp3_44100_32"
    | "mp3_44100_64"
    | "mp3_44100_96"
    | "mp3_44100_128"
    | "mp3_44100_192";
  /**
   * Pronunciation dictionaries to apply to the text, in order of precedence. Up to 3.
   */
  pronunciation_dictionary_locators?: Array<PronunciationDictionaryVersionLocator>;
  /**
   * The model to use for the generation.
   */
  model_id: "eleven_multilingual_v2";
  /**
   * Overrides for the voice's saved settings, applied to this generation only.
   */
  voice_settings?: TtsVoiceSettings | null;
};

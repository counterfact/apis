import type { PodcastConversationMode } from "./PodcastConversationMode.js";
import type { PodcastBulletinMode } from "./PodcastBulletinMode.js";
import type { PodcastTextSource } from "./PodcastTextSource.js";
import type { PodcastURLSource } from "./PodcastURLSource.js";
import type { QualityPresetType } from "./QualityPresetType.js";
export type Body_Create_podcast_v1_studio_podcasts_post = {
  /**
   * The ID of the model to be used for this Studio project, you can query GET /v1/models to list all available models.
   */
  model_id: string;
  /**
   * The type of podcast to generate. Can be 'conversation', an interaction between two voices, or 'bulletin', a monologue.
   */
  mode: PodcastConversationMode | PodcastBulletinMode;
  /**
   * The source content for the Podcast.
   */
  source:
    | PodcastTextSource
    | PodcastURLSource
    | Array<PodcastTextSource | PodcastURLSource>;
  /**
   * Output quality of the generated audio. Must be one of:
   * 'standard' - standard output format, 128kbps with 44.1kHz sample rate.
   * 'high' - high quality output format, 192kbps with 44.1kHz sample rate and major improvements on our side.
   * 'ultra' - ultra quality output format, 192kbps with 44.1kHz sample rate and highest improvements on our side.
   * 'ultra_lossless' - ultra quality output format, 705.6kbps with 44.1kHz sample rate and highest improvements on our side in a fully lossless format.
   * If not provided, defaults to the highest quality preset available on your subscription tier.
   *
   */
  quality_preset?: QualityPresetType | null;
  /**
   * Duration of the generated podcast. Must be one of:
   * short - produces podcasts shorter than 3 minutes.
   * default - produces podcasts roughly between 3-7 minutes.
   * long - produces podcasts longer than 7 minutes.
   *
   * @default "default"
   */
  duration_scale?: "short" | "default" | "long";
  /**
   * An optional language of the Studio project. Two-letter language code (ISO 639-1).
   */
  language?: string | null;
  /**
   * The intro text that will always be added to the beginning of the podcast.
   */
  intro?: string | null;
  /**
   * The outro text that will always be added to the end of the podcast.
   */
  outro?: string | null;
  /**
   * Additional instructions prompt for the podcast generation used to adjust the podcast's style and tone.
   */
  instructions_prompt?: string | null;
  /**
   * A brief summary or highlights of the Studio project's content, providing key points or themes. This should be between 10 and 70 characters.
   */
  highlights?: Array<string> | null;
  /**
   *
   *     A url that will be called by our service when the Studio project is converted. Request will contain a json blob containing the status of the conversion
   *     Messages:
   *     1. When project was converted successfully:
   *     {
   *       type: "project_conversion_status",
   *       event_timestamp: 1234567890,
   *       data: {
   *         request_id: "1234567890",
   *         project_id: "21m00Tcm4TlvDq8ikWAM",
   *         conversion_status: "success",
   *         project_snapshot_id: "22m00Tcm4TlvDq8ikMAT",
   *         error_details: None,
   *       }
   *     }
   *     2. When project conversion failed:
   *     {
   *       type: "project_conversion_status",
   *       event_timestamp: 1234567890,
   *       data: {
   *         request_id: "1234567890",
   *         project_id: "21m00Tcm4TlvDq8ikWAM",
   *         conversion_status: "error",
   *         project_snapshot_id: None,
   *         error_details: "Error details if conversion failed"
   *       }
   *     }
   *
   *     3. When chapter was converted successfully:
   *     {
   *       type: "chapter_conversion_status",
   *       event_timestamp: 1234567890,
   *       data: {
   *         request_id: "1234567890",
   *         project_id: "21m00Tcm4TlvDq8ikWAM",
   *         chapter_id: "22m00Tcm4TlvDq8ikMAT",
   *         conversion_status: "success",
   *         chapter_snapshot_id: "23m00Tcm4TlvDq8ikMAV",
   *         error_details: None,
   *       }
   *     }
   *     4. When chapter conversion failed:
   *     {
   *       type: "chapter_conversion_status",
   *       event_timestamp: 1234567890,
   *       data: {
   *         request_id: "1234567890",
   *         project_id: "21m00Tcm4TlvDq8ikWAM",
   *         chapter_id: "22m00Tcm4TlvDq8ikMAT",
   *         conversion_status: "error",
   *         chapter_snapshot_id: None,
   *         error_details: "Error details if conversion failed"
   *       }
   *     }
   *
   */
  callback_url?: string | null;
  /**
   *
   *     This parameter controls text normalization with four modes: 'auto', 'on', 'apply_english' and 'off'.
   *     When set to 'auto', the system will automatically decide whether to apply text normalization
   *     (e.g., spelling out numbers). With 'on', text normalization will always be applied, while
   *     with 'off', it will be skipped. 'apply_english' is the same as 'on' but will assume that text is in English.
   *
   */
  apply_text_normalization?: ("auto" | "on" | "off" | "apply_english") | null;
};

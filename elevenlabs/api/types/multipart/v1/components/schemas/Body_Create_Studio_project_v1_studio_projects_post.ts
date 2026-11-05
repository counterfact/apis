import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
import type { QualityPresetType } from "./QualityPresetType.js";
export type Body_Create_Studio_project_v1_studio_projects_post = {
  /**
   * The name of the Studio project, used for identification only.
   */
  name: string;
  /**
   * The voice_id that corresponds to the default voice used for new titles.
   */
  default_title_voice_id?: string | null;
  /**
   * The voice_id that corresponds to the default voice used for new paragraphs.
   */
  default_paragraph_voice_id?: string | null;
  /**
   * The ID of the model to be used for this Studio project, you can query GET /v1/models to list all available models.
   */
  default_model_id?: string | null;
  /**
   * An optional URL from which we will extract content to initialize the Studio project. If this is set, 'from_url' and 'from_content' must be null. If neither 'from_url', 'from_document', 'from_content' are provided we will initialize the Studio project as blank.
   */
  from_url?: string | null;
  /**
   * An optional .epub, .pdf, .txt or similar file can be provided. If provided, we will initialize the Studio project with its content. If this is set, 'from_url' and 'from_content' must be null. If neither 'from_url', 'from_document', 'from_content' are provided we will initialize the Studio project as blank.
   */
  from_document?: MultipartFile | null;
  /**
   *
   *     An optional content to initialize the Studio project with. If this is set, 'from_url' and 'from_document' must be null. If neither 'from_url', 'from_document', 'from_content' are provided we will initialize the Studio project as blank.
   *
   *     Example:
   *     [{"name": "Chapter A", "blocks": [{"sub_type": "p", "nodes": [{"voice_id": "6lCwbsX1yVjD49QmpkT0", "text": "A", "type": "tts_node"}, {"voice_id": "6lCwbsX1yVjD49QmpkT1", "text": "B", "type": "tts_node"}]}, {"sub_type": "h1", "nodes": [{"voice_id": "6lCwbsX1yVjD49QmpkT0", "text": "C", "type": "tts_node"}, {"voice_id": "6lCwbsX1yVjD49QmpkT1", "text": "D", "type": "tts_node"}]}]}, {"name": "Chapter B", "blocks": [{"sub_type": "p", "nodes": [{"voice_id": "6lCwbsX1yVjD49QmpkT0", "text": "E", "type": "tts_node"}, {"voice_id": "6lCwbsX1yVjD49QmpkT1", "text": "F", "type": "tts_node"}]}, {"sub_type": "h2", "nodes": [{"voice_id": "6lCwbsX1yVjD49QmpkT0", "text": "G", "type": "tts_node"}, {"voice_id": "6lCwbsX1yVjD49QmpkT1", "text": "H", "type": "tts_node"}]}]}]
   *
   */
  from_content_json?: string;
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
   * An optional name of the author of the Studio project, this will be added as metadata to the mp3 file on Studio project or chapter download.
   */
  title?: string | null;
  /**
   * An optional name of the author of the Studio project, this will be added as metadata to the mp3 file on Studio project or chapter download.
   */
  author?: string | null;
  /**
   * An optional description of the Studio project.
   */
  description?: string | null;
  /**
   * An optional list of genres associated with the Studio project.
   */
  genres?: Array<string>;
  /**
   * An optional target audience of the Studio project.
   */
  target_audience?: ("children" | "young adult" | "adult" | "all ages") | null;
  /**
   * An optional language of the Studio project. Two-letter language code (ISO 639-1).
   */
  language?: string | null;
  /**
   * An optional content type of the Studio project.
   */
  content_type?: string | null;
  /**
   * An optional original publication date of the Studio project, in the format YYYY-MM-DD or YYYY.
   */
  original_publication_date?: string | null;
  /**
   * An optional specification of whether this Studio project contains mature content.
   * @default false
   */
  mature_content?: boolean | null;
  /**
   * An optional ISBN number of the Studio project you want to create, this will be added as metadata to the mp3 file on Studio project or chapter download.
   */
  isbn_number?: string | null;
  /**
   * [Deprecated] When the Studio project is downloaded, should the returned audio have postprocessing in order to make it compliant with audiobook normalized volume requirements
   * @default false
   */
  acx_volume_normalization?: boolean;
  /**
   * When the Studio project is downloaded, should the returned audio have postprocessing in order to make it compliant with audiobook normalized volume requirements
   * @default false
   */
  volume_normalization?: boolean;
  /**
   * A list of pronunciation dictionary locators (pronunciation_dictionary_id, version_id) encoded as a list of JSON strings for pronunciation dictionaries to be applied to the text. A list of json encoded strings is required as adding projects may occur through formData as opposed to jsonBody. To specify multiple dictionaries use multiple --form lines in your curl, such as --form 'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"Vmd4Zor6fplcA7WrINey\",\"version_id\":\"hRPaxjlTdR7wFMhV4w0b\"}"' --form 'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"JzWtcGQMJ6bnlWwyMo7e\",\"version_id\":\"lbmwxiLu4q6txYxgdZqn\"}"'.
   */
  pronunciation_dictionary_locators?: Array<string>;
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
   * An optional specification of whether the content of this Studio project is fiction.
   */
  fiction?: ("fiction" | "non-fiction") | null;
  /**
   *
   *     This parameter controls text normalization with four modes: 'auto', 'on', 'apply_english' and 'off'.
   *     When set to 'auto', the system will automatically decide whether to apply text normalization
   *     (e.g., spelling out numbers). With 'on', text normalization will always be applied, while
   *     with 'off', it will be skipped. 'apply_english' is the same as 'on' but will assume that text is in English.
   *
   */
  apply_text_normalization?: ("auto" | "on" | "off" | "apply_english") | null;
  /**
   * Whether to auto convert the Studio project to audio or not.
   * @default false
   */
  auto_convert?: boolean;
  /**
   * [Alpha Feature] Whether automatically assign voices to phrases in the create Project.
   * @default false
   */
  auto_assign_voices?: boolean | null;
  /**
   * The type of Studio project to create.
   */
  source_type?:
    ("blank" | "book" | "article" | "genfm" | "video" | "screenplay") | null;
  /**
   *     Optional voice settings overrides for the project, encoded as a list of JSON strings.
   *
   *     Example:
   *     ["{\"voice_id\": \"21m00Tcm4TlvDq8ikWAM\", \"stability\": 0.7, \"similarity_boost\": 0.8, \"style\": 0.5, \"speed\": 1.0, \"use_speaker_boost\": true}"]
   *
   */
  voice_settings?: Array<string>;
  /**
   * If true, creates a corresponding read for direct publishing in draft state
   * @default false
   */
  create_publishing_read?: boolean | null;
};

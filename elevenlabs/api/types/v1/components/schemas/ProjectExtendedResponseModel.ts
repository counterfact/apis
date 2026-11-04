import type { ProjectCreationMetaResponseModel } from "./ProjectCreationMetaResponseModel.js";
import type { CaptionStyleModel } from "./CaptionStyleModel.js";
import type { StudioAgentSettingsModel } from "./StudioAgentSettingsModel.js";
import type { QualityPresetType } from "./QualityPresetType.js";
import type { ChapterResponseModel } from "./ChapterResponseModel.js";
import type { PronunciationDictionaryVersionResponseModel } from "./PronunciationDictionaryVersionResponseModel.js";
import type { PronunciationDictionaryLocatorResponseModel } from "./PronunciationDictionaryLocatorResponseModel.js";
import type { ProjectVideoResponseModel } from "./ProjectVideoResponseModel.js";
import type { ProjectExternalAudioResponseModel } from "./ProjectExternalAudioResponseModel.js";
import type { ProjectImageResponseModel } from "./ProjectImageResponseModel.js";
import type { ProjectVoiceResponseModel } from "./ProjectVoiceResponseModel.js";
import type { VoiceResponseModel } from "./VoiceResponseModel.js";
import type { DirectPublishingReadResponseModel } from "./DirectPublishingReadResponseModel.js";
/**
 * @example {"access_level":"viewer","apply_text_normalization":"auto","assets":[],"author":"John Doe","base_voices":[],"can_be_downloaded":true,"chapters":[{"can_be_downloaded":true,"chapter_id":"aw1NgEzBg83R7vgmiJt6","conversion_progress":0.5,"last_conversion_date_unix":1714204800,"last_conversion_error":"Error message","name":"Chapter 1","state":"converting","statistics":{"characters_converted":500,"characters_unconverted":1000,"credits_needed_to_convert":1000,"paragraphs_converted":20,"paragraphs_unconverted":10,"voice_statistics":[{"characters_converted":300,"characters_unconverted":600,"project_voice_ref_id":"voice123","voice_id":"voice123"},{"characters_converted":200,"characters_unconverted":400,"project_voice_ref_id":"voice456","voice_id":"voice456"}]}}],"content_type":"Novel","cover_image_url":"https://example.com/cover.jpg","create_date_unix":1714204800,"created_by_user_id":"Vbtgl3bRdj6lk79rYAgx","creation_meta":{"creation_progress":0.5,"status":"pending","type":"blank"},"default_model_id":"eleven_multilingual_v2","default_paragraph_voice_id":"JBFqnCBsd6RMkjVDRZzb","default_paragraph_voice_ref_id":"JBFqnCBsd6RMkjVDRZzb","default_title_voice_id":"JBFqnCBsd6RMkjVDRZzb","default_title_voice_ref_id":"JBFqnCBsd6RMkjVDRZzb","description":"This is a description of my project.","experimental":{},"fiction":"fiction","genres":["Novel","Short Story"],"isbn_number":"978-90-274-3964-2","language":"en","last_conversion_date_unix":1714204800,"mature_content":false,"name":"My Project","original_publication_date":"2025-01-01","project_id":"aw1NgEzBg83R7vgmiJt6","pronunciation_dictionary_locators":[],"pronunciation_dictionary_versions":[],"public_share_id":"abc123def456789","quality_check_on":false,"quality_check_on_when_bulk_convert":false,"quality_preset":"standard","state":"default","target_audience":"young adult","title":"My Project","voices":[],"volume_normalization":true}
 */
export type ProjectExtendedResponseModel = {
  /**
   * The ID of the project.
   */
  project_id: string;
  /**
   * The name of the project.
   */
  name: string;
  /**
   * The creation date of the project.
   */
  create_date_unix: number;
  /**
   * The user ID who created the project.
   */
  created_by_user_id: string | null;
  /**
   * The default title project voice reference ID.
   */
  default_title_voice_ref_id: string;
  /**
   * The default paragraph project voice reference ID.
   */
  default_paragraph_voice_ref_id: string;
  /**
   * The default model ID.
   */
  default_model_id: string;
  /**
   * The last conversion date of the project.
   */
  last_conversion_date_unix?: number | null;
  /**
   * Whether the project can be downloaded.
   */
  can_be_downloaded: boolean;
  /**
   * The title of the project.
   */
  title?: string | null;
  /**
   * The author of the project.
   */
  author?: string | null;
  /**
   * The description of the project.
   */
  description?: string | null;
  /**
   * List of genres of the project.
   */
  genres?: Array<string> | null;
  /**
   * The cover image URL of the project.
   */
  cover_image_url?: string | null;
  /**
   * The target audience of the project.
   */
  target_audience?: ("children" | "young adult" | "adult" | "all ages") | null;
  /**
   * Two-letter language code (ISO 639-1) of the language of the project.
   */
  language?: string | null;
  /**
   * The content type of the project, e.g. 'Novel' or 'Short Story'
   */
  content_type?: string | null;
  /**
   * The original publication date of the project.
   */
  original_publication_date?: string | null;
  /**
   * Whether the project contains mature content.
   */
  mature_content?: boolean | null;
  /**
   * The ISBN number of the project.
   */
  isbn_number?: string | null;
  /**
   * Whether the project uses volume normalization.
   */
  volume_normalization: boolean;
  /**
   * The state of the project.
   */
  state: "creating" | "default" | "converting" | "in_queue";
  /**
   * The access level of the project.
   */
  access_level: "admin" | "editor" | "commenter" | "viewer";
  /**
   * Whether the project is fiction.
   */
  fiction?: ("fiction" | "non-fiction") | null;
  /**
   * Whether quality check is enabled for this project.
   * @deprecated
   */
  quality_check_on: boolean;
  /**
   * Whether quality check is enabled on the project when bulk converting.
   * @deprecated
   */
  quality_check_on_when_bulk_convert: boolean;
  /**
   * The creation meta of the project.
   */
  creation_meta?: ProjectCreationMetaResponseModel | null;
  /**
   * The source type of the project.
   */
  source_type?:
    ("blank" | "book" | "article" | "genfm" | "video" | "screenplay") | null;
  /**
   * Whether chapters are enabled for the project.
   * @default true
   */
  chapters_enabled?: boolean | null;
  /**
   * Whether captions are enabled for the project.
   * @default true
   */
  captions_enabled?: boolean | null;
  /**
   * Global styling to be applied to all captions
   */
  caption_style?: CaptionStyleModel | null;
  /**
   * Styling changes that have been made to the provided templates
   */
  caption_style_template_overrides?: {
    [key: string]: CaptionStyleModel;
  } | null;
  /**
   * The public share ID of the project.
   */
  public_share_id?: string | null;
  /**
   * The aspect ratio of the project.
   */
  aspect_ratio?: ("16:9" | "9:16" | "4:5" | "1:1") | null;
  /**
   * Agent-related settings for the project
   */
  agent_settings?: StudioAgentSettingsModel | null;
  /**
   * The quality preset level of the project.
   */
  quality_preset: QualityPresetType;
  /**
   * List of chapters of the project and their metadata.
   */
  chapters: Array<ChapterResponseModel>;
  /**
   * List of pronunciation dictionary versions of the project and their metadata.
   */
  pronunciation_dictionary_versions: Array<PronunciationDictionaryVersionResponseModel>;
  /**
   * List of pronunciation dictionary locators.
   */
  pronunciation_dictionary_locators: Array<PronunciationDictionaryLocatorResponseModel>;
  /**
   * Whether text normalization is applied to the project.
   */
  apply_text_normalization: "auto" | "on" | "off" | "apply_english";
  /**
   * Experimental features for the project.
   */
  experimental?: { [key: string]: unknown };
  /**
   * List of uploaded assets e.g. videos, audios.
   */
  assets: Array<
    | ProjectVideoResponseModel
    | ProjectExternalAudioResponseModel
    | ProjectImageResponseModel
  >;
  /**
   * List of configured project voices.
   */
  voices: Array<ProjectVoiceResponseModel>;
  /**
   * List of voices used by the project.
   */
  base_voices?: Array<VoiceResponseModel> | null;
  /**
   * The ElevenReader data if the book was published.
   */
  publishing_read?: DirectPublishingReadResponseModel | null;
  /**
   * The default title voice ID.
   * @deprecated
   */
  default_title_voice_id: string;
  /**
   * The default paragraph voice ID.
   * @deprecated
   */
  default_paragraph_voice_id: string;
};

import type { ReadMetadataChapterDBModel } from "./ReadMetadataChapterDBModel.js";
import type { ReadLegalTerms } from "./ReadLegalTerms.js";
import type { Contributor } from "./Contributor.js";
import type { PreviewAudioDBModel } from "./PreviewAudioDBModel.js";
import type { SampleConfigDBModel } from "./SampleConfigDBModel.js";
import type { ReviewResponseModel } from "./ReviewResponseModel.js";
export type DirectPublishingReadResponseModel = {
  read_id: string;
  created_at_unix: number;
  updated_at_unix: number;
  word_count: number;
  char_count: number;
  chapters: Array<ReadMetadataChapterDBModel>;
  title?: string | null;
  author?: string | null;
  description?: string | null;
  article_image_url?: string | null;
  language?: string | null;
  locale?: string | null;
  display_mode?: ("text" | "audio-only" | "text-with-audio") | null;
  genre?: Array<
    | "Fantasy"
    | "Romance"
    | "Science Fiction"
    | "Mystery and Thriller"
    | "Action and Adventure"
    | "Dystopia"
    | "Business and Economics"
    | "Technology"
    | "Christian & Inspirational"
    | "Horror"
    | "Biography and Memoir"
    | "Education and Learning"
    | "History"
    | "Children's Literature"
    | "Young Adult"
    | "Fairy Tales and Folklore"
    | "Fan Fiction"
    | "General Fiction"
    | "Health and Wellness"
    | "Historical Fiction"
    | "Humor"
    | "Literary Classics"
    | "Philosophy"
    | "Poetry"
    | "Politics and Government"
    | "Psychology"
    | "Science and Nature"
    | "Self-Help"
    | "Spirituality and Religion"
    | "Travel"
    | "True Crime"
    | "Other"
  > | null;
  fiction?: string | null;
  content_type?: string | null;
  original_file_type?: string | null;
  target_audience?: ("children" | "young adult" | "adult" | "all ages") | null;
  mature_content?: boolean | null;
  safesearch_adult?: boolean | null;
  origin?: string | null;
  publication_date?: string | null;
  isbn?: string | null;
  ean?: string | null;
  legal_terms?: ReadLegalTerms | null;
  content_guidelines_terms?: ReadLegalTerms | null;
  last_updated_from_project_unix?: number | null;
  publishing_project_id?: string | null;
  /**
   * @default "published"
   */
  publishing_state?: string;
  publisher_profile_id?: string | null;
  quality_score?: number | null;
  publisher?: string | null;
  copyright?: string | null;
  subtitle?: string | null;
  distribution_territories?: Array<string> | null;
  edition?: string | null;
  contributors?: Array<Contributor> | null;
  payout_type?: ("none" | "engagement_based" | "fixed_payout") | null;
  list_price?: number | null;
  currency?: "usd" | null;
  original_audio_project_export_id?: string | null;
  original_audio_document_id?: string | null;
  series_id?: string | null;
  volume?: number | null;
  published_at_unix?: number | null;
  read_slug?: string | null;
  preview_audio_object?: PreviewAudioDBModel | null;
  sample_config?: SampleConfigDBModel | null;
  review?: ReviewResponseModel | null;
  voice_id?: string | null;
  /**
   * @default true
   */
  can_use_assistant?: boolean;
  /**
   * @default false
   */
  is_voice_changer_on?: boolean;
  restricted_to_user_email_domains?: Array<string> | null;
};

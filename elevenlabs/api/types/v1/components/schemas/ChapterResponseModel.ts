import type { ChapterStatisticsResponseModel } from "./ChapterStatisticsResponseModel.js";
/**
 * @example {"can_be_downloaded":true,"chapter_id":"aw1NgEzBg83R7vgmiJt6","conversion_progress":0.5,"last_conversion_date_unix":1714204800,"last_conversion_error":"Error message","name":"Chapter 1","state":"converting","statistics":{"characters_converted":500,"characters_unconverted":1000,"credits_needed_to_convert":1000,"paragraphs_converted":20,"paragraphs_unconverted":10,"voice_statistics":[{"characters_converted":300,"characters_unconverted":600,"project_voice_ref_id":"voice123","voice_id":"voice123"},{"characters_converted":200,"characters_unconverted":400,"project_voice_ref_id":"voice456","voice_id":"voice456"}]}}
 */
export type ChapterResponseModel = {
  /**
   * The ID of the chapter.
   */
  chapter_id: string;
  /**
   * The name of the chapter.
   */
  name: string;
  /**
   * The last conversion date of the chapter.
   */
  last_conversion_date_unix?: number | null;
  /**
   * The conversion progress of the chapter.
   */
  conversion_progress?: number | null;
  /**
   * Whether the chapter can be downloaded.
   */
  can_be_downloaded: boolean;
  /**
   * The state of the chapter.
   */
  state: "default" | "converting";
  /**
   * Whether the chapter has a video.
   */
  has_video?: boolean | null;
  /**
   * Whether the chapter has any visual content (video, image, or text clips).
   */
  has_visual_content?: boolean | null;
  /**
   * List of voice ids used by the chapter
   */
  voice_ids?: Array<string> | null;
  /**
   * The statistics of the chapter.
   */
  statistics?: ChapterStatisticsResponseModel | null;
  /**
   * The last conversion error of the chapter.
   */
  last_conversion_error?: string | null;
};

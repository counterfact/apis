import type { VoiceStatisticsResponseModel } from "./VoiceStatisticsResponseModel.js";
/**
 * @example {"characters_converted":500,"characters_unconverted":1000,"credits_needed_to_convert":1000,"paragraphs_converted":20,"paragraphs_unconverted":10,"voice_statistics":[{"characters_converted":300,"characters_unconverted":600,"project_voice_ref_id":"voice123","voice_id":"voice123"},{"characters_converted":200,"characters_unconverted":400,"project_voice_ref_id":"voice456","voice_id":"voice456"}]}
 */
export type ChapterStatisticsResponseModel = {
  /**
   * The number of unconverted characters.
   */
  characters_unconverted: number;
  /**
   * The number of converted characters.
   */
  characters_converted: number;
  /**
   * The number of converted paragraphs.
   */
  paragraphs_converted: number;
  /**
   * The number of unconverted paragraphs.
   */
  paragraphs_unconverted: number;
  /**
   * The number of credits needed to convert the remaining paragraphs.
   */
  credits_needed_to_convert?: number | null;
  /**
   * Per-voice breakdown of character counts.
   */
  voice_statistics?: Array<VoiceStatisticsResponseModel> | null;
};

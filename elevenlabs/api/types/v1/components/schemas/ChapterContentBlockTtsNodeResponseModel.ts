export type ChapterContentBlockTtsNodeResponseModel = {
  type: "tts_node";
  project_voice_ref_id: string;
  text: string;
  /**
   * @deprecated
   */
  voice_id: string;
};

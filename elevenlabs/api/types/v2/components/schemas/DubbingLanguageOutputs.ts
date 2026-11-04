/**
 * Signed, time-limited download URLs for a language target's outputs.
 */
export type DubbingLanguageOutputs = {
  /**
   * Signed URL for the dubbed lossless audio track, in FLAC. The link expires one hour after it is issued; re-read the language target for a fresh one.
   */
  lossless_audio?: string | null;
  /**
   * Signed URL for the translated lines as WebVTT subtitles, timed to the source speech. Null when none are available, such as for languages dubbed before subtitles were produced. The link expires one hour after it is issued.
   */
  subtitles?: string | null;
};

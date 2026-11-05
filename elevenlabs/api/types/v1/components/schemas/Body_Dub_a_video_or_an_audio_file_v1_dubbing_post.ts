export type Body_Dub_a_video_or_an_audio_file_v1_dubbing_post = {
  /**
   * A list of file paths to audio recordings intended for voice cloning
   */
  file?: (Uint8Array | string) | null;
  /**
   * CSV file containing transcription/translation metadata
   */
  csv_file?: (Uint8Array | string) | null;
  /**
   * For use only with csv input
   */
  foreground_audio_file?: (Uint8Array | string) | null;
  /**
   * For use only with csv input
   */
  background_audio_file?: (Uint8Array | string) | null;
  /**
   * Name of the dubbing project.
   */
  name?: string | null;
  /**
   * URL of the source video/audio file.
   */
  source_url?: string | null;
  /**
   * Source language. Expects a valid iso639-1 or iso639-3 language code.
   * @default "auto"
   */
  source_lang?: string;
  /**
   * The Target language to dub the content into. Expects a valid iso639-1 or iso639-3 language code.
   */
  target_lang?: string | null;
  /**
   * [Experimental] An accent to apply when selecting voices from the library and to use to inform translation of the dialect to prefer.
   */
  target_accent?: string | null;
  /**
   * Number of speakers to use for the dubbing. Set to 0 to automatically detect the number of speakers
   * @default 0
   */
  num_speakers?: number;
  /**
   * Whether to apply watermark to the output video.
   * @default false
   */
  watermark?: boolean;
  /**
   * Start time of the source video/audio file.
   */
  start_time?: number | null;
  /**
   * End time of the source video/audio file.
   */
  end_time?: number | null;
  /**
   * Whether to use the highest resolution available.
   * @default false
   */
  highest_resolution?: boolean;
  /**
   * An advanced setting. Whether to drop background audio from the final dub. This can improve dub quality where it's known that audio shouldn't have a background track such as for speeches or monologues.
   * @default false
   */
  drop_background_audio?: boolean;
  /**
   * [BETA] Whether transcripts should have profanities censored with the words '[censored]'
   */
  use_profanity_filter?: boolean | null;
  /**
   * Whether to prepare dub for edits in dubbing studio or edits as a dubbing resource.
   * @default false
   */
  dubbing_studio?: boolean;
  /**
   * Instead of using a voice clone in dubbing, use a similar voice from the ElevenLabs Voice Library. Voices used from the library will contribute towards a workspace's custom voices limit, and if there aren't enough available slots the dub will fail. Using this feature requires the caller to have the 'add_voice_from_voice_library' permission on their workspace to access new voices.
   * @default false
   */
  disable_voice_cloning?: boolean;
  /**
   * The mode in which to run this Dubbing job. Defaults to automatic, use manual if specifically providing a CSV transcript to use. Note that manual mode is experimental and production use is strongly discouraged.
   * @default "automatic"
   */
  mode?: "automatic" | "manual";
  /**
   * Frames per second to use when parsing a CSV file for dubbing. If not provided, FPS will be inferred from timecodes.
   */
  csv_fps?: number | null;
};

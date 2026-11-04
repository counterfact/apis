import type { MusicModelID } from "./MusicModelID.js";
export type Body_Video_to_Music_v1_music_video_to_music_post = {
  /**
   *
   *             One or more video files sent via FormData array (multipart/form-data). They will be combined into one codec in order.
   *             A maximum of 10 videos is allowed, where the total size of the combined video is limited to 200MB.
   *             In total, the video can be up to 600 seconds long. Note that combining multiple videos may increase the request duration significantly. If possible, combine the videos beforehand.
   *
   */
  videos: Array<Uint8Array | string>;
  /**
   * Optional text description of the music you want. A maximum of 4100 characters is allowed.
   */
  description?: string | null;
  /**
   * Optional list of style tags (e.g. ['upbeat', 'cinematic']). A maximum of 10 tags is allowed.
   * @default []
   */
  tags?: Array<string>;
  /**
   * The model to use for the generation.
   * @default "music_v1"
   */
  model_id?: MusicModelID;
  /**
   * When true, incorporate SFX cues from the video.
   * @default false
   */
  add_sfx?: boolean;
  /**
   * When true, return a ZIP with separate music and SFX audio tracks instead of a single mixed file. Use this for more flexibility to layer the tracks.
   * @default false
   */
  separate_tracks?: boolean;
  /**
   * When true, analyze the video's audio track and use its genres, BPM, instrumentation, mood, and arc as reference characteristics for music generation.
   * @default false
   */
  use_audio_as_reference?: boolean;
  /**
   * Whether to sign the generated song with C2PA. Applicable only for mp3 files.
   * @default false
   */
  sign_with_c2pa?: boolean;
};

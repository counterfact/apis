import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
import type { MusicModelID } from "./MusicModelID.js";
export type Body_Upload_music_v1_music_upload_post = {
  /**
   * The audio file to upload.
   * @format binary
   */
  file: MultipartFile;
  /**
   * Whether to generate and return the composition plan for the uploaded song. Pass a model id (`music_v1`, `music_v2` or `music_v2_5`) to control which composition plan format is returned. Passing `true`/`false` is deprecated; `true` defaults to the `music_v1` plan format. Enabling this will increase the latency.
   * @default false
   */
  extract_composition_plan?: boolean | MusicModelID;
  /**
   * Whether to transcribe the uploaded song and return word-level timestamps. If True, the response will include words_timestamps but will increase the latency.
   * @default false
   */
  with_timestamps?: boolean;
  /**
   * Whether to return the visual waveform of the uploaded song.
   * @default false
   */
  with_waveform_visual?: boolean;
};

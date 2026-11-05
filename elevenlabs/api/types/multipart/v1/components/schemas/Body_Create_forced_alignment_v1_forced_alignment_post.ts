import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
export type Body_Create_forced_alignment_v1_forced_alignment_post = {
  /**
   * The file to align. All major audio formats are supported. The file size must be less than 1GB.
   * @format binary
   */
  file: MultipartFile;
  /**
   * The text to align with the audio. The input text can be in any format, however diarization is not supported at this time.
   */
  text: string;
};

export type Body_Stem_separation_v1_music_stem_separation_post = {
  /**
   * The audio file to separate into stems.
   * @format binary
   */
  file: Uint8Array | string;
  /**
   * The id of the stem variation to use.
   * @default "six_stems_v1"
   */
  stem_variation_id?: "two_stems_v1" | "six_stems_v1";
  /**
   * Whether to sign the generated song with C2PA. Applicable only for mp3 files.
   * @default false
   */
  sign_with_c2pa?: boolean;
};

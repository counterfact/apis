export type UpdateMusicFinetuneRequestModel = {
  /**
   * Updated name for the finetune.
   */
  name?: string | null;
  /**
   * Replacement set of tags.
   */
  tags?: Array<string> | null;
  /**
   * Updated primary musical genre.
   */
  primary_genre?: string | null;
  /**
   * Finetune visibility. Only 'private' and 'workspace' can be set.
   */
  visibility?: ("private" | "workspace") | null;
};

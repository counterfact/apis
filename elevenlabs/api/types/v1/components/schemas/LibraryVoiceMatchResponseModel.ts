/**
 * A Voice Library voice the uploaded audio matched, offered in place of the clone.
 */
export type LibraryVoiceMatchResponseModel = {
  /**
   * The ID of the matched Voice Library voice.
   */
  library_voice_id: string;
  /**
   * The public owner ID of the Voice Library voice. Pass it with library_voice_id to POST /v1/voices/add/{public_user_id}/{voice_id} to add the voice.
   */
  public_owner_id: string;
};

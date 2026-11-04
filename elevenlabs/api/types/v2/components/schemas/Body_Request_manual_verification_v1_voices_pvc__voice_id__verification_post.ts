export type Body_Request_manual_verification_v1_voices_pvc__voice_id__verification_post =
  {
    /**
     * Verification documents
     */
    files: Array<Uint8Array | string>;
    /**
     * Extra text to be used in the manual verification process.
     */
    extra_text?: string | null;
  };

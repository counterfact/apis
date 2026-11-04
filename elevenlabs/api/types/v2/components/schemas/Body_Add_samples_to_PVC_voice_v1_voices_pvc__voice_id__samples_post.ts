export type Body_Add_samples_to_PVC_voice_v1_voices_pvc__voice_id__samples_post =
  {
    /**
     * Audio files used to create the voice.
     */
    files: Array<Uint8Array | string>;
    /**
     * If set will remove background noise for voice samples using our audio isolation model. If the samples do not include background noise, it can make the quality worse.
     * @default false
     */
    remove_background_noise?: boolean;
  };

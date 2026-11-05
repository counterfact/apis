export type Body_Update_PVC_voice_sample_v1_voices_pvc__voice_id__samples__sample_id__post =
  {
    /**
     * If set will remove background noise for voice samples using our audio isolation model. If the samples do not include background noise, it can make the quality worse.
     * @default false
     */
    remove_background_noise?: boolean;
    /**
     * Speaker IDs to be used for PVC training. Make sure you send all the speaker IDs you want to use for PVC training in one request because the last request will override the previous ones.
     */
    selected_speaker_ids?: Array<string> | null;
    /**
     * The start time of the audio to be used for PVC training. Time should be in milliseconds
     */
    trim_start_time?: number | null;
    /**
     * The end time of the audio to be used for PVC training. Time should be in milliseconds
     */
    trim_end_time?: number | null;
    /**
     * The name of the audio file to be used for PVC training.
     */
    file_name?: string | null;
  };

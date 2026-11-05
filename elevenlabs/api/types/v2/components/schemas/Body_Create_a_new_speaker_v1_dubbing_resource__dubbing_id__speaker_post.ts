export type Body_Create_a_new_speaker_v1_dubbing_resource__dubbing_id__speaker_post =
  {
    /**
     * Name to attribute to this speaker.
     */
    speaker_name?: string | null;
    /**
     * Either the identifier of a voice from the ElevenLabs voice library, or one of ['track-clone', 'clip-clone'].
     */
    voice_id?: string | null;
    /**
     * For models that support it, the voice similarity value to use. This will default to 0.65, with a valid range of [0.0, 1.0].
     */
    voice_stability?: number | null;
    /**
     * For models that support it, the voice similarity value to use. This will default to 1.0, with a valid range of [0.0, 1.0].
     */
    voice_similarity?: number | null;
    /**
     * For models that support it, the voice style value to use. This will default to 1.0, with a valid range of [0.0, 1.0].
     */
    voice_style?: number | null;
  };

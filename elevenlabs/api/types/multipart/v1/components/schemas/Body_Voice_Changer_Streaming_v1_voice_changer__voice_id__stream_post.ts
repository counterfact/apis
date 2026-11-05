import type { MultipartFile } from "../../../../../counterfact-types/index.ts";
export type Body_Voice_Changer_Streaming_v1_voice_changer__voice_id__stream_post =
  {
    /**
     * The audio file which holds the content and emotion that will control the generated speech.
     * @format binary
     */
    audio: MultipartFile;
    /**
     * Identifier of the model that will be used, you can query them using GET /v1/models. The model needs to have support for speech to speech, you can check this using the can_do_voice_conversion property.
     * @default "eleven_english_sts_v2"
     */
    model_id?: string;
    /**
     * Voice settings overriding stored settings for the given voice. They are applied only on the given request. Needs to be send as a JSON encoded string.
     */
    voice_settings?: string | null;
    /**
     * If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result. Determinism is not guaranteed. Must be integer between 0 and 4294967295.
     */
    seed?: number | null;
    /**
     * If set, will remove the background noise from your audio input using our audio isolation model. Only applies to Voice Changer.
     * @default false
     */
    remove_background_noise?: boolean;
    /**
     * The format of input audio. Options are 'pcm_s16le_16' or 'other' For `pcm_s16le_16`, the input audio must be 16-bit PCM at a 16kHz sample rate, single channel (mono), and little-endian byte order. Latency will be lower than with passing an encoded waveform.
     * @default "other"
     */
    file_format?: ("pcm_s16le_16" | "other") | null;
  };

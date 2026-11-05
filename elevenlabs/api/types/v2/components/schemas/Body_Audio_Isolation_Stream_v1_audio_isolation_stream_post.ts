export type Body_Audio_Isolation_Stream_v1_audio_isolation_stream_post = {
  /**
   * The audio file from which vocals/speech will be isolated from.
   * @format binary
   */
  audio: Uint8Array | string;
  /**
   * The format of input audio. Options are 'pcm_s16le_16' or 'other' For `pcm_s16le_16`, the input audio must be 16-bit PCM at a 16kHz sample rate, single channel (mono), and little-endian byte order. Latency will be lower than with passing an encoded waveform.
   * @default "other"
   */
  file_format?: ("pcm_s16le_16" | "other") | null;
};

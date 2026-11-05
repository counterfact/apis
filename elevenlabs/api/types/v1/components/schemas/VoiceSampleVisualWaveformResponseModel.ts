/**
 * @example {"sample_id":"DCwhRBWXzGAHq8TQ4Fs18","visual_waveform":[0.1,0.2,0.3,0.4,0.5]}
 */
export type VoiceSampleVisualWaveformResponseModel = {
  /**
   * The ID of the sample.
   */
  sample_id: string;
  /**
   * The visual waveform of the sample, represented as a list of floats.
   */
  visual_waveform: Array<number>;
};

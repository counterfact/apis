/**
 * ``BURSTY`` clients stream ahead of wall time, so decisions use the audio clock.
 * @default "realtime"
 */
export type AudioInputPacing = "realtime" | "bursty";

export type PendingCancellationResponseModel = {
  /**
   * @default "cancellation"
   */
  kind?: "cancellation";
  /**
   * The timestamp of the cancellation.
   */
  timestamp_seconds: number;
};

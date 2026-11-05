/**
 * @example {"dubbing_id":"21m00Tcm4TlvDq8ikWAM","expected_duration_sec":127.5}
 */
export type DoDubbingResponseModel = {
  /**
   * The ID of the dubbing project.
   */
  dubbing_id: string;
  /**
   * The expected duration of the dubbing project in seconds.
   */
  expected_duration_sec: number;
};

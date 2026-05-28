/**
 * Provides details of a hosted runner custom image version
 */
export type actions_hosted_runner_custom_image_version = {
  /**
   * The version of image.
   * @example "1.0.0"
   */
  version: string;
  /**
   * The state of image version.
   * @example "Ready"
   */
  state: string;
  /**
   * Image version size in GB.
   * @example 30
   */
  size_gb: number;
  /**
   * The creation date time of the image version.
   * @example "2024-11-09T23:39:01Z"
   */
  created_on: string;
  /**
   * The image version status details.
   * @example "None"
   */
  state_details: string;
};

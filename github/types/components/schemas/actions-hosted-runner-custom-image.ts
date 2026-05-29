/**
 * Provides details of a custom runner image
 */
export type actions_hosted_runner_custom_image = {
  /**
   * The ID of the image. Use this ID for the `image` parameter when creating a new larger runner.
   * @example 1
   */
  id: number;
  /**
   * The operating system of the image.
   * @example "linux-x64"
   */
  platform: string;
  /**
   * Total size of all the image versions in GB.
   * @example 200
   */
  total_versions_size: number;
  /**
   * Display name for this image.
   * @example "CustomImage"
   */
  name: string;
  /**
   * The image provider.
   * @example "custom"
   */
  source: string;
  /**
   * The number of image versions associated with the image.
   * @example 4
   */
  versions_count: number;
  /**
   * The latest image version associated with the image.
   * @example "1.3.0"
   */
  latest_version: string;
  /**
   * The number of image versions associated with the image.
   * @example "Ready"
   */
  state: string;
};

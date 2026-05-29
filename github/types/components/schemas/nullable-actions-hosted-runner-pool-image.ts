/**
 * Provides details of a hosted runner image
 */
export type nullable_actions_hosted_runner_pool_image = {
  /**
   * The ID of the image. Use this ID for the `image` parameter when creating a new larger runner.
   * @example "ubuntu-20.04"
   */
  id: string;
  /**
   * Image size in GB.
   * @example 86
   */
  size_gb: number;
  /**
   * Display name for this image.
   * @example 20.04
   */
  display_name: string;
  /**
   * The image provider.
   */
  source: "github" | "partner" | "custom";
  /**
   * The image version of the hosted runner pool.
   * @example "latest"
   */
  version?: string;
};

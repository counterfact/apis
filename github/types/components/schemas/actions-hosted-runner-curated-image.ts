/**
 * Provides details of a hosted runner image
 */
export type actions_hosted_runner_curated_image = {
  /**
   * The ID of the image. Use this ID for the `image` parameter when creating a new larger runner.
   * @example "ubuntu-20.04"
   */
  id: string;
  /**
   * The operating system of the image.
   * @example "linux-x64"
   */
  platform: string;
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
};

import type { nullable_actions_hosted_runner_pool_image } from "./nullable-actions-hosted-runner-pool-image.js";
import type { actions_hosted_runner_machine_spec } from "./actions-hosted-runner-machine-spec.js";
import type { public_ip } from "./public-ip.js";

/**
 * A Github-hosted hosted runner.
 */
export type actions_hosted_runner = {
  /**
   * The unique identifier of the hosted runner.
   * @example 5
   */
  id: number;
  /**
   * The name of the hosted runner.
   * @example "my-github-hosted-runner"
   */
  name: string;
  /**
   * The unique identifier of the group that the hosted runner belongs to.
   * @example 2
   */
  runner_group_id?: number;
  image_details: nullable_actions_hosted_runner_pool_image;
  machine_size_details: actions_hosted_runner_machine_spec;
  /**
   * The status of the runner.
   * @example "Ready"
   */
  status: "Ready" | "Provisioning" | "Shutdown" | "Deleting" | "Stuck";
  /**
   * The operating system of the image.
   * @example "linux-x64"
   */
  platform: string;
  /**
   * The maximum amount of hosted runners. Runners will not scale automatically above this number. Use this setting to limit your cost.
   * @default 10
   * @example 5
   */
  maximum_runners?: number;
  /**
   * Whether public IP is enabled for the hosted runners.
   * @example true
   */
  public_ip_enabled: boolean;
  /**
   * The public IP ranges when public IP is enabled for the hosted runners.
   */
  public_ips?: Array<public_ip>;
  /**
   * The time at which the runner was last used, in ISO 8601 format.
   * @format date-time
   * @example "2022-10-09T23:39:01Z"
   */
  last_active_on?: string;
  /**
   * Whether custom image generation is enabled for the hosted runners.
   */
  image_gen?: boolean;
};

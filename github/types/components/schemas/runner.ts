import type { runner_label } from "./runner-label.js";

/**
 * A self hosted runner
 */
export type runner = {
  /**
   * The ID of the runner.
   * @example 5
   */
  id: number;
  /**
   * The ID of the runner group.
   * @example 1
   */
  runner_group_id?: number;
  /**
   * The name of the runner.
   * @example "iMac"
   */
  name: string;
  /**
   * The Operating System of the runner.
   * @example "macos"
   */
  os: string;
  /**
   * The status of the runner.
   * @example "online"
   */
  status: string;
  busy: boolean;
  labels: Array<runner_label>;
  ephemeral?: boolean;
};

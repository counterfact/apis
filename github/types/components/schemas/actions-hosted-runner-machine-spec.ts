/**
 * Provides details of a particular machine spec.
 */
export type actions_hosted_runner_machine_spec = {
  /**
   * The ID used for the `size` parameter when creating a new runner.
   * @example "8-core"
   */
  id: string;
  /**
   * The number of cores.
   * @example 8
   */
  cpu_cores: number;
  /**
   * The available RAM for the machine spec.
   * @example 32
   */
  memory_gb: number;
  /**
   * The available SSD storage for the machine spec.
   * @example 300
   */
  storage_gb: number;
};

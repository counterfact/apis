/**
 * A description of the machine powering a codespace.
 */
export type codespace_machine = {
  /**
   * The name of the machine.
   * @example "standardLinux"
   */
  name: string;
  /**
   * The display name of the machine includes cores, memory, and storage.
   * @example "4 cores, 16 GB RAM, 64 GB storage"
   */
  display_name: string;
  /**
   * The operating system of the machine.
   * @example "linux"
   */
  operating_system: string;
  /**
   * How much storage is available to the codespace.
   * @example 68719476736
   */
  storage_in_bytes: number;
  /**
   * How much memory is available to the codespace.
   * @example 17179869184
   */
  memory_in_bytes: number;
  /**
   * How many cores are available to the codespace.
   * @example 4
   */
  cpus: number;
  /**
   * Whether a prebuild is currently available when creating a codespace for this machine and repository. If a branch was not specified as a ref, the default branch will be assumed. Value will be "null" if prebuilds are not supported or prebuild availability could not be determined. Value will be "none" if no prebuild is available. Latest values "ready" and "in_progress" indicate the prebuild availability status.
   * @example "ready"
   */
  prebuild_availability: "none" | "ready" | "in_progress";
};

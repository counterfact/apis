import type { traffic } from "./traffic.js";

/**
 * Clone Traffic
 */
export type clone_traffic = {
  /**
   * @example 173
   */
  count: number;
  /**
   * @example 128
   */
  uniques: number;
  clones: Array<traffic>;
};

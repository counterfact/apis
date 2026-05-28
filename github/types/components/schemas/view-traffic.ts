import type { traffic } from "./traffic.js";

/**
 * View Traffic
 */
export type view_traffic = {
  /**
   * @example 14850
   */
  count: number;
  /**
   * @example 3782
   */
  uniques: number;
  views: Array<traffic>;
};

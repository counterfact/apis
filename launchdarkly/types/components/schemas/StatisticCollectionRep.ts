import type { StatisticRep } from "./StatisticRep.js";

export type StatisticCollectionRep = {
  /**
   * A map of flag keys to a list of code reference statistics for each code repository in which the flag key appears
   */
  flags: { [key: string]: Array<StatisticRep> };
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};

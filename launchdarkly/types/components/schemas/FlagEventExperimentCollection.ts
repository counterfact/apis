import type { FlagEventExperiment } from "./FlagEventExperiment.js";

export type FlagEventExperimentCollection = {
  /**
   * The total number of experiments
   * @example 1
   */
  totalCount: number;
  /**
   * A list of experiments
   */
  items: Array<FlagEventExperiment>;
};

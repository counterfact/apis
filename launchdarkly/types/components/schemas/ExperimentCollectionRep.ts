import type { Experiment } from "./Experiment.js";

export type ExperimentCollectionRep = {
  /**
   * An array of experiments
   */
  items: Array<Experiment>;
  /**
   * The total number of experiments in this project and environment. Does not include legacy experiments.
   */
  total_count?: number;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};

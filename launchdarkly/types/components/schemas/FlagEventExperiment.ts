import type { FlagEventExperimentIteration } from "./FlagEventExperimentIteration.js";

export type FlagEventExperiment = {
  /**
   * The experiment key
   * @example "experiment-1"
   */
  key: string;
  /**
   * The experiment name
   * @example "Experiment 1"
   */
  name: string;
  /**
   * The experiment iteration
   */
  iteration: FlagEventExperimentIteration;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};

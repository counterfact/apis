import type { IterationInput } from "./IterationInput.js";

export type ExperimentPost = {
  /**
   * The experiment name
   * @example "Example experiment"
   */
  name: string;
  /**
   * The experiment description
   * @example "An example experiment, used in testing"
   */
  description?: string;
  /**
   * The ID of the member who maintains this experiment
   * @example "12ab3c45de678910fgh12345"
   */
  maintainerId?: string;
  /**
   * The experiment key
   * @example "experiment-key-123abc"
   */
  key: string;
  /**
   * Details on the construction of the initial iteration
   */
  iteration: IterationInput;
};

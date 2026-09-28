import type { UnixMillis } from "./UnixMillis.js";
import type { IterationRep } from "./IterationRep.js";

export type Experiment = {
  /**
   * The experiment ID
   * @example "12ab3c45de678910fgh12345"
   */
  _id?: string;
  /**
   * The experiment key
   * @example "experiment-key-123abc"
   */
  key: string;
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
   * The ID of the member who maintains this experiment.
   * @example "12ab3c45de678910fgh12345"
   */
  _maintainerId: string;
  /**
   * Timestamp of when the experiment was created
   * @example "1654104600000"
   */
  _creationDate: UnixMillis;
  environmentKey?: string;
  /**
   * Timestamp of when the experiment was archived
   * @example "1654104600000"
   */
  archivedDate?: UnixMillis;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/projects/my-project/environments/my-environment","type":"application/json"},"self":{"href":"/api/v2/projects/my-project/environments/my-environment/experiments/my-experiment","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * Details on the current iteration
   */
  currentIteration?: IterationRep;
  /**
   * Details on the current iteration. This iteration may be already started, or may still be a draft.
   */
  draftIteration?: IterationRep;
  /**
   * Details on the previous iterations for this experiment.
   */
  previousIterations?: Array<IterationRep>;
};

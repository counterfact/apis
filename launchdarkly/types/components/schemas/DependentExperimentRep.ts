import type { UnixMillis } from "./UnixMillis.js";

export type DependentExperimentRep = {
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
   * The environment ID
   * @example "1234a56b7c89d012345e678f"
   */
  environmentId: string;
  /**
   * The environment key
   * @example "production"
   */
  environmentKey: string;
  /**
   * Timestamp of when the experiment was created
   * @example "1654104600000"
   */
  creationDate: UnixMillis;
  /**
   * Timestamp of when the experiment was archived
   * @example "1654104600000"
   */
  archivedDate?: UnixMillis;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/projects/my-project/environments/my-environment","type":"application/json"},"self":{"href":"/api/v2/projects/my-project/environments/my-environment/experiments/example-experiment","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
};

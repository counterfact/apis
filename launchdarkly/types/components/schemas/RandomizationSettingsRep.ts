import type { RandomizationUnitRep } from "./RandomizationUnitRep.js";
import type { UnixMillis } from "./UnixMillis.js";

export type RandomizationSettingsRep = {
  /**
   * The project ID
   * @example "12345abcde67890fghij"
   */
  _projectId?: string;
  /**
   * The project key
   * @example "project-key-123abc"
   */
  _projectKey?: string;
  /**
   * An array of the randomization units in this project
   */
  randomizationUnits?: Array<RandomizationUnitRep>;
  /**
   * Timestamp of when the experiment was created
   * @example "1654104600000"
   */
  _creationDate?: UnixMillis;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};

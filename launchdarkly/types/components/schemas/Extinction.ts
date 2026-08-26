import type { UnixMillis } from "./UnixMillis.js";

export type Extinction = {
  /**
   * The identifier for the revision where flag became extinct. For example, a commit SHA.
   * @example "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3"
   */
  revision: string;
  /**
   * Description of the extinction. For example, the commit message for the revision.
   * @example "Remove flag for launched feature"
   */
  message: string;
  /**
   * Time of extinction
   * @example "1636558831870"
   */
  time: UnixMillis;
  /**
   * The feature flag key
   * @example "enable-feature"
   */
  flagKey: string;
  /**
   * The project key
   * @example "default"
   */
  projKey: string;
};

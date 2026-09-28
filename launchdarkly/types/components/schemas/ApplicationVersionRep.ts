import type { Access } from "./Access.js";
import type { UnixMillis } from "./UnixMillis.js";

export type ApplicationVersionRep = {
  /**
   * Details on the allowed and denied actions for this application version
   */
  _access?: Access;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * Version of the application version
   */
  _version?: number;
  /**
   * Whether the application version was automatically created, because it was included in a context when a LaunchDarkly SDK evaluated a feature flag, or if the application version was created through the LaunchDarkly UI or REST API.
   * @example true
   */
  autoAdded: boolean;
  /**
   * Timestamp of when the application version was created
   * @example "1654104600000"
   */
  creationDate?: UnixMillis;
  /**
   * The unique identifier of this application version
   * @example "2"
   */
  key: string;
  /**
   * The name of this version
   * @example "01.02.03"
   */
  name: string;
  /**
   * Whether this version is supported. Only applicable if the application <code>kind</code> is <code>mobile</code>.
   * @example true
   */
  supported?: boolean;
};

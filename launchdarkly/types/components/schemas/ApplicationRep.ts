import type { ApplicationFlagCollectionRep } from "./ApplicationFlagCollectionRep.js";
import type { Access } from "./Access.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { MaintainerRep } from "./MaintainerRep.js";

export type ApplicationRep = {
  /**
   * Details about the flags that have been evaluated by the application
   */
  flags?: ApplicationFlagCollectionRep;
  /**
   * Details on the allowed and denied actions for this application
   */
  _access?: Access;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * Version of the application
   */
  _version?: number;
  /**
   * Whether the application was automatically created because it was included in a context when a LaunchDarkly SDK evaluated a feature flag, or was created through the LaunchDarkly UI or REST API.
   * @example true
   */
  autoAdded: boolean;
  /**
   * Timestamp of when the application version was created
   * @example "1654104600000"
   */
  creationDate?: UnixMillis;
  /**
   * The application description
   * @example "The LaunchDarkly Cafe app"
   */
  description?: string;
  /**
   * The unique identifier of this application
   * @example "com.launchdarkly.cafe"
   */
  key: string;
  /**
   * To distinguish the kind of application
   * @example "mobile"
   */
  kind: "browser" | "mobile" | "server";
  /**
   * Associated maintainer member or team info for the application
   */
  _maintainer?: MaintainerRep;
  /**
   * The name of the application
   * @example "LaunchDarklyCafe"
   */
  name: string;
};

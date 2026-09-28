import type { ObjectId } from "./ObjectId.js";
import type { MemberSummary } from "./MemberSummary.js";
import type { Access } from "./Access.js";
import type { Statement } from "./Statement.js";
import type { UnixMillis } from "./UnixMillis.js";

export type RelayAutoConfigRep = {
  /**
   * The ID of the Relay Proxy configuration
   * @example "12ab3c45de678910abc12345"
   */
  _id: ObjectId;
  /**
   * Details on the member who created this Relay Proxy configuration
   */
  _creator?: MemberSummary;
  /**
   * Details on the allowed and denied actions for this Relay Proxy configuration
   */
  _access?: Access;
  /**
   * A human-friendly name for the Relay Proxy configuration
   * @example "Relay Proxy Demo Config"
   */
  name: string;
  /**
   * A description of what environments and projects the Relay Proxy should include or exclude
   */
  policy: Array<Statement>;
  /**
   * The Relay Proxy configuration key
   */
  fullKey: string;
  /**
   * The last few characters of the Relay Proxy configuration key, displayed in the LaunchDarkly UI
   * @example "7f30"
   */
  displayKey: string;
  /**
   * Timestamp of when the Relay Proxy configuration was created
   * @example "1628001602644"
   */
  creationDate: UnixMillis;
  /**
   * Timestamp of when the Relay Proxy configuration was most recently modified
   * @example "1628001602644"
   */
  lastModified: UnixMillis;
};

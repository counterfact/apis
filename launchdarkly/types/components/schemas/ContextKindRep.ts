import type { UnixMillis } from "./UnixMillis.js";
import type { ContextKindCreatedFrom } from "./ContextKindCreatedFrom.js";

export type ContextKindRep = {
  /**
   * The context kind key
   * @example "organization-key-123abc"
   */
  key: string;
  /**
   * The context kind name
   * @example "Organization"
   */
  name: string;
  /**
   * The context kind description
   * @example "An example context kind, to enable targeting based on organization"
   */
  description: string;
  /**
   * The context kind version
   * @example 4
   */
  version: number;
  /**
   * Timestamp of when the context kind was created
   * @example "1668530155141"
   */
  creationDate: UnixMillis;
  /**
   * Timestamp of when the context kind was most recently changed
   * @example "1670341705251"
   */
  lastModified: UnixMillis;
  /**
   * Timestamp of when a context of this context kind was most recently evaluated
   * @example "1671563538193"
   */
  lastSeen?: UnixMillis;
  /**
   * How the context kind was created
   * @example "auto-add"
   */
  createdFrom: ContextKindCreatedFrom;
  /**
   * Alias for archived.
   * @example false
   */
  hideInTargeting?: boolean;
  /**
   * Whether the context kind is archived. Archived context kinds are unavailable for targeting.
   * @example false
   */
  archived?: boolean;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};

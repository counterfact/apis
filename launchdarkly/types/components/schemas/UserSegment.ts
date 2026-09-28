import type { UnixMillis } from "./UnixMillis.js";
import type { SegmentTarget } from "./SegmentTarget.js";
import type { UserSegmentRule } from "./UserSegmentRule.js";
import type { Access } from "./Access.js";
import type { FlagListingRep } from "./FlagListingRep.js";
import type { SegmentMetadata } from "./SegmentMetadata.js";

export type UserSegment = {
  /**
   * A human-friendly name for the segment.
   * @example "Example segment"
   */
  name: string;
  /**
   * A description of the segment's purpose. Defaults to <code>null</code> and is omitted in the response if not provided.
   * @example "Bundle our sample customers together"
   */
  description?: string;
  /**
   * Tags for the segment. Defaults to an empty array.
   * @example ["testing"]
   */
  tags: Array<string>;
  /**
   * Timestamp of when the segment was created
   * @example "1654104600000"
   */
  creationDate: UnixMillis;
  /**
   * Timestamp of when the segment was last modified
   * @example "1654104600000"
   */
  lastModifiedDate: UnixMillis;
  /**
   * A unique key used to reference the segment
   * @example "segment-key-123abc"
   */
  key: string;
  /**
   * An array of keys for included targets. Included individual targets are always segment members, regardless of segment rules. For list-based segments over 15,000 entries, also called big segments, this array is either empty or omitted.
   * @example ["user-key-123abc"]
   */
  included?: Array<string>;
  /**
   * An array of keys for excluded targets. Segment rules bypass individual excluded targets, so they will never be included based on rules. Excluded targets may still be included explicitly. This value is omitted for list-based segments over 15,000 entries, also called big segments.
   * @example ["user-key-123abc"]
   */
  excluded?: Array<string>;
  includedContexts?: Array<SegmentTarget>;
  excludedContexts?: Array<SegmentTarget>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * An array of the targeting rules for this segment.
   * @example [{"_id":"1234a56b7c89d012345e678f","clauses":[{"_id":"12ab3c45de678910fab12345","attribute":"email","negate":false,"op":"endsWith","values":[".edu"]}]}]
   */
  rules: Array<UserSegmentRule>;
  /**
   * Version of the segment
   * @example 1
   */
  version: number;
  /**
   * Whether the segment has been deleted
   * @example false
   */
  deleted: boolean;
  _access?: Access;
  /**
   * A list of flags targeting this segment. Only included when getting a single segment, using the <code>getSegment</code> endpoint.
   */
  _flags?: Array<FlagListingRep>;
  /**
   * Whether this is a standard segment (<code>false</code>) or a big segment (<code>true</code>). Standard segments include rule-based segments and smaller list-based segments. Big segments include larger list-based segments and synced segments. If omitted, the segment is a standard segment.
   * @example false
   */
  unbounded?: boolean;
  /**
   * For big segments, the targeted context kind.
   */
  unboundedContextKind?: string;
  /**
   * For big segments, how many times this segment has been created.
   */
  generation: number;
  /**
   * Details on the external data store backing this segment. Only applies to big segments.
   */
  _unboundedMetadata?: SegmentMetadata;
  /**
   * The external data store backing this segment. Only applies to synced segments.
   * @example "amplitude"
   */
  _external?: string;
  /**
   * The URL for the external data store backing this segment. Only applies to synced segments.
   * @example "https://analytics.amplitude.com/org/1234/cohort/123abc"
   */
  _externalLink?: string;
  /**
   * Whether an import is currently in progress for the specified segment. Only applies to big segments.
   * @example false
   */
  _importInProgress?: boolean;
};

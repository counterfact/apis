export type ContextInstanceSegmentMembership = {
  /**
   * A human-friendly name for the segment
   * @example "Segment Name"
   */
  name: string;
  /**
   * A unique key used to reference the segment
   * @example "segment-key-123abc"
   */
  key: string;
  /**
   * A description of the segment's purpose
   * @example "Segment description"
   */
  description: string;
  /**
   * Whether this is an unbounded segment. Unbounded segments, also called big segments, may be list-based segments with more than 15,000 entries, or synced segments.
   * @example false
   */
  unbounded: boolean;
  /**
   * If the segment is a synced segment, the name of the external source
   * @example "https://amplitude.com/myCohort"
   */
  external: string;
  /**
   * Whether the context is a member of this segment, either by explicit inclusion or by rule matching
   * @example true
   */
  isMember: boolean;
  /**
   * Whether the context is explicitly included in this segment
   * @example true
   */
  isIndividuallyTargeted: boolean;
  /**
   * Whether the context is captured by this segment's rules. The value of this field is undefined if the context is also explicitly included (<code>isIndividuallyTargeted</code> is <code>true</code>).
   * @example false
   */
  isRuleTargeted: boolean;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};

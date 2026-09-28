export type SegmentBody = {
  /**
   * A human-friendly name for the segment
   * @example "Example segment"
   */
  name: string;
  /**
   * A unique key used to reference the segment
   * @example "segment-key-123abc"
   */
  key: string;
  /**
   * A description of the segment's purpose
   * @example "Bundle our sample customers together"
   */
  description?: string;
  /**
   * Tags for the segment
   * @example ["testing"]
   */
  tags?: Array<string>;
  /**
   * Whether to create a standard segment (<code>false</code>) or a big segment (<code>true</code>). Standard segments include rule-based and smaller list-based segments. Big segments include larger list-based segments and synced segments. Only use a big segment if you need to add more than 15,000 individual targets.
   * @example false
   */
  unbounded?: boolean;
  /**
   * For big segments, the targeted context kind.
   * @example "device"
   */
  unboundedContextKind?: string;
};

import type { SegmentId } from "./SegmentId.js";
import type { UnixMillis } from "./UnixMillis.js";

export type SegmentMetadata = {
  envId?: string;
  segmentId?: SegmentId;
  version?: number;
  includedCount?: number;
  excludedCount?: number;
  lastModified?: UnixMillis;
  deleted?: boolean;
};

import type { UnixMillis } from "./UnixMillis.js";

export type TimestampRep = {
  milliseconds?: UnixMillis;
  /**
   * @format int64
   */
  seconds?: number;
  rfc3339?: string;
  simple?: string;
};

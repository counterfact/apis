import type { UnixMillis } from "./UnixMillis.js";

export type RecentTriggerBody = {
  /**
   * Timestamp of the incoming trigger webhook
   * @example "1654104600000"
   */
  timestamp?: UnixMillis;
  /**
   * The marshalled JSON request body for the incoming trigger webhook. If this is empty or contains invalid JSON, the timestamp is recorded but this field will be empty.
   */
  jsonBody?: { [key: string]: unknown };
};

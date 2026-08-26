import type { UnixMillis } from "./UnixMillis.js";

export type StoreIntegrationError = {
  statusCode?: number;
  message?: string;
  timestamp?: UnixMillis;
};

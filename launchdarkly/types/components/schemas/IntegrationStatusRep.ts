import type { UnixMillis } from "./UnixMillis.js";

export type IntegrationStatusRep = {
  statusCode?: number;
  responseBody?: string;
  timestamp?: UnixMillis;
};

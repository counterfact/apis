import type { UnixMillis } from "./UnixMillis.js";
import type { IntegrationStatusRep } from "./IntegrationStatusRep.js";

export type IntegrationSubscriptionStatusRep = {
  successCount?: number;
  lastSuccess?: UnixMillis;
  lastError?: UnixMillis;
  errorCount?: number;
  errors?: Array<IntegrationStatusRep>;
};

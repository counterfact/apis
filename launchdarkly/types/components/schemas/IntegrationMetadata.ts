import type { IntegrationStatus } from "./IntegrationStatus.js";
import type { UnixMillis } from "./UnixMillis.js";

export type IntegrationMetadata = {
  externalId: string;
  externalStatus: IntegrationStatus;
  externalUrl: string;
  lastChecked: UnixMillis;
};

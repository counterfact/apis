import type { OTelResource } from "./OTelResource.js";
import type { OTelScopeSpans } from "./OTelScopeSpans.js";
export type OTelResourceSpans = {
  resource: OTelResource;
  scopeSpans: Array<OTelScopeSpans>;
};

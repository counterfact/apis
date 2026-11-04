import type { OTelScope } from "./OTelScope.js";
import type { OTelSpan } from "./OTelSpan.js";
export type OTelScopeSpans = { scope: OTelScope; spans: Array<OTelSpan> };

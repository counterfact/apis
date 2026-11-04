import type { OTelAttribute } from "./OTelAttribute.js";
import type { OTelStatus } from "./OTelStatus.js";
export type OTelSpan = {
  traceId: string;
  spanId: string;
  parentSpanId?: string | null;
  name: string;
  kind: number;
  startTimeUnixNano: string;
  endTimeUnixNano: string;
  attributes: Array<OTelAttribute>;
  status: OTelStatus;
};

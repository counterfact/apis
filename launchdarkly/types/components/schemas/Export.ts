import type { UnixMillis } from "./UnixMillis.js";
import type { InitiatorRep } from "./InitiatorRep.js";

export type Export = {
  /**
   * The export ID
   * @example "1234a567-bcd8-9123-4567-abcd1234567f"
   */
  id: string;
  /**
   * The segment key
   * @example "example-big-segment"
   */
  segmentKey: string;
  /**
   * Timestamp of when this export was created
   * @example "1654104600000"
   */
  creationTime: UnixMillis;
  /**
   * The export status
   * @example "complete"
   */
  status: string;
  /**
   * The export size, in bytes
   * @format int64
   * @example 18
   */
  sizeBytes: number;
  /**
   * The export size, with units
   * @example "18 B"
   */
  size: string;
  /**
   * Details on the member who initiated the export
   * @example "{\"name\": \"Ariel Flores\", \"email\": \"ariel@acme.com\"}"
   */
  initiator: InitiatorRep;
  /**
   * The location and content type of related resources, including the location of the exported file
   */
  _links: { [key: string]: unknown };
};

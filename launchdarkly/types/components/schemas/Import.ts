import type { UnixMillis } from "./UnixMillis.js";
import type { FileRep } from "./FileRep.js";

export type Import = {
  /**
   * The import ID
   * @example "1234a567-bcd8-9123-4567-abcd1234567f"
   */
  id: string;
  /**
   * The segment key
   * @example "example-big-segment"
   */
  segmentKey: string;
  /**
   * Timestamp of when this import was created
   * @example "1654104600000"
   */
  creationTime: UnixMillis;
  /**
   * The import mode used, either <code>merge</code> or <code>replace</code>
   * @example "replace"
   */
  mode: string;
  /**
   * The import status
   * @example "complete"
   */
  status: string;
  /**
   * The imported files and their status
   * @example [{"filename":"bigsegimport.csv","status":"complete"}]
   */
  files?: Array<FileRep>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};

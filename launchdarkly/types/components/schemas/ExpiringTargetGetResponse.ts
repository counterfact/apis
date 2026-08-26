import type { ExpiringTarget } from "./ExpiringTarget.js";

export type ExpiringTargetGetResponse = {
  /**
   * A list of expiring targets
   */
  items: Array<ExpiringTarget>;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};

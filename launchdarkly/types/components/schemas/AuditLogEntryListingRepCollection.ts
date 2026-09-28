import type { AuditLogEntryListingRep } from "./AuditLogEntryListingRep.js";

export type AuditLogEntryListingRepCollection = {
  /**
   * An array of audit log entries
   */
  items: Array<AuditLogEntryListingRep>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};

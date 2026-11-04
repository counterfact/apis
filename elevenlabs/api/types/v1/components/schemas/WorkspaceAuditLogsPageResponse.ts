import type { WorkspaceAuditLogEntryResponse } from "./WorkspaceAuditLogEntryResponse.js";
/**
 * Paginated workspace audit log response.
 */
export type WorkspaceAuditLogsPageResponse = {
  entries: Array<WorkspaceAuditLogEntryResponse>;
  has_more: boolean;
  next_cursor: string | null;
};

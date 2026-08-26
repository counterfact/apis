import type { getAuditLogEntries } from "../../../types/paths/api/v2/auditlog.types.js";

export const GET: getAuditLogEntries = async ($) => {
  return $.response[200].random();
};

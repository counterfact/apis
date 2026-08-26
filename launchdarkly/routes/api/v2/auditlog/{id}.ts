import type { getAuditLogEntry } from "../../../../types/paths/api/v2/auditlog/{id}.types.js";

export const GET: getAuditLogEntry = async ($) => {
  return $.response[200].random();
};

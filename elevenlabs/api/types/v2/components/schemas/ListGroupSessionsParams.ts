/**
 * List scheduled group sessions for a group service in a date range.
 *
 * Group services are scheduled in advance (e.g. yoga classes, workshops) and
 * callers register against an existing session. Use this for group services;
 * use ``check_service_availability`` for appointment / rental services.
 */
export type ListGroupSessionsParams = {
  /**
   * @default "list_group_sessions"
   */
  smb_tool_type?: "list_group_sessions";
};

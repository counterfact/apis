/**
 * Permanently remove a previously-cancelled calendar event.
 *
 * This delete tool is the irreversible follow-up to cancel_calendar_event.
 * The backend rejects the call (422) if the event hasn't been
 * cancelled yet, so the only safe path is cancel-then-delete.
 */
export type DeleteCalendarEventParams = {
  /**
   * @default "delete_calendar_event"
   */
  smb_tool_type?: "delete_calendar_event";
};

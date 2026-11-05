/**
 * Appointments with the booking channel, internal notes and intake answers.
 */
export type OwnerGetClientAppointmentsParams = {
  /**
   * @default false
   */
  include_cancelled?: boolean;
  /**
   * @default "owner_get_client_appointments"
   */
  smb_tool_type?: "owner_get_client_appointments";
};

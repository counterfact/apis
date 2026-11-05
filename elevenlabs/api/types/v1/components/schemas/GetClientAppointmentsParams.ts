export type GetClientAppointmentsParams = {
  /**
   * @default false
   */
  include_cancelled?: boolean;
  /**
   * @default "get_client_appointments"
   */
  smb_tool_type?: "get_client_appointments";
};

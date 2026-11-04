/**
 * Create a new staff member in the system.
 */
export type CreateStaffParams = {
  /**
   * @default "create_staff"
   */
  smb_tool_type?: "create_staff";
  /**
   * Whether to offer a working_hours timezone, set from the workspace's enable_per_resource_timezones. While that is off every staff member uses the workspace timezone, so the key is not offered.
   * @default false
   */
  per_resource_timezones?: boolean;
};

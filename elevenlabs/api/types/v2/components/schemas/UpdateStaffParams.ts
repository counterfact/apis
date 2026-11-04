/**
 * Update an existing staff member's information.
 */
export type UpdateStaffParams = {
  /**
   * @default "update_staff"
   */
  smb_tool_type?: "update_staff";
  /**
   * Whether to offer a working_hours timezone, set from the workspace's enable_per_resource_timezones. While that is off every staff member uses the workspace timezone, so the key is not offered.
   * @default false
   */
  per_resource_timezones?: boolean;
};

/**
 * Every owner-editable field, working hours included.
 */
export type OwnerListStaffParams = {
  list_kwargs?: { [key: string]: unknown };
  /**
   * @default "owner_list_staff"
   */
  smb_tool_type?: "owner_list_staff";
};

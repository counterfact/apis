/**
 * Every owner-editable field, including what callers must not hear.
 */
export type OwnerListServicesParams = {
  list_kwargs?: { [key: string]: unknown };
  /**
   * @default "owner_list_services"
   */
  smb_tool_type?: "owner_list_services";
};

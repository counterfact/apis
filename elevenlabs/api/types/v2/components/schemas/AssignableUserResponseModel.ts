export type AssignableUserResponseModel = {
  user_id: string;
  email: string;
  first_name: string | null;
  is_service_account: boolean;
  /**
   * Whether this workspace member currently has at least viewer access to the agent. Members without access are still returned so they can be surfaced (e.g. grayed out) and granted access before being assigned.
   */
  has_access: boolean;
};

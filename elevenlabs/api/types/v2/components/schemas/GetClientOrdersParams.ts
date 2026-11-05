export type GetClientOrdersParams = {
  /**
   * @default "get_client_orders"
   */
  smb_tool_type?: "get_client_orders";
  /**
   * @default false
   */
  include_cancelled?: boolean;
};
